import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when, reaction } from 'mobx';
import { View, Image, Text, Dimensions, LayoutAnimation, TouchableOpacity, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import InlineUrlPreviewConsent from './inline-url-preview-consent';
import inlineImageCacheStore from './inline-image-cache-store';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import settingsState from '../settings/settings-state';
import { clientApp, config, util } from '../../lib/icebear';
import { T, tx } from '../utils/translator';

const toSettings = text => (
    <Text
        onPress={() => {
            settingsState.transition('preferences');
            settingsState.transition('display');
        }}
        style={{ textDecorationLine: 'underline' }}>
        {text}
    </Text>
);

const toSettingsParser = { toSettings };

@observer
export default class FileInlineImage extends SafeComponent {
    @observable width = 0;
    @observable height = 0;
    @observable optimalContentWidth = 0;
    @observable optimalContentHeight = 0;
    @observable opened;
    @observable loaded;
    @observable tooBig;
    @observable loadImage;
    @observable showUpdateSettingsLink;
    @observable cachedImage;
    outerPadding = 8;

    componentWillMount() {
        reaction(() => clientApp.uiUserPrefs.externalContentConsented, () => {
            this.showUpdateSettingsLink = true;
        });
        this.optimalContentHeight = Dimensions.get('window').height;
        this.opened = clientApp.uiUserPrefs.peerioContentEnabled;
        when(() => this.cachedImage, () => this.fetchSize());
        const { image } = this.props;
        const { fileId, url, oversized, isOverInlineSizeLimit } = image;
        if (fileId) {
            // we have local inline file
            this.tooBig = isOverInlineSizeLimit;
            when(() => image.tmpCached, () => {
                this.cachedImage = inlineImageCacheStore.getImage(image.tmpCachePath);
            });
            if (!image.tmpCached) {
                when(() => this.loadImage, async () => {
                    if (await config.FileStream.exists(image.tmpCachePath)) {
                        image.tmpCached = true;
                        return;
                    }
                    image.downloadToTmpCache();
                });
            }
            this.loadImage = clientApp.uiUserPrefs.peerioContentEnabled && !this.tooBig;
        } else {
            // we have external url
            this.tooBig = oversized;
            this.loadImage = clientApp.uiUserPrefs.externalContentEnabled && !this.tooBig;
            when(() => this.loadImage, () => {
                this.opened = true;
                this.cachedImage = inlineImageCacheStore.getImage(url);
            });
        }
    }

    fetchSize() {
        const { cachedImage } = this;
        // console.log('fetch size');
        when(() => cachedImage.width && cachedImage.height && this.optimalContentWidth, () => {
            const { width, height } = cachedImage;
            const { optimalContentWidth, optimalContentHeight } = this;
            let w = width + 0.0, h = height + 0.0;
            // console.log(w, h, optimalContentHeight, optimalContentWidth);
            if (w > optimalContentWidth) {
                h *= optimalContentWidth / w;
                w = optimalContentWidth;
            }
            if (h > optimalContentHeight) {
                w *= optimalContentHeight / h;
                h = optimalContentHeight;
            }
            this.width = Math.floor(w);
            this.height = Math.floor(h);
            console.debug(`calculated width: ${this.width}, ${this.height}`);
        });
    }

    componentDidMount() {
        reaction(() => this.opened, () => LayoutAnimation.easeInEaseOut());
    }

    layout = (evt) => {
        this.optimalContentWidth = evt.nativeEvent.layout.width - this.outerPadding * 2 - 2;
    }

    get displayTooBigImageOffer() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark
        };
        const text = {
            color: vars.bg,
            fontStyle: 'italic',
            marginVertical: 10
        };
        return (
            <View style={outer}>
                <Text style={text0}>
                    {tx('title_imageSizeWarning', { size: util.formatBytes(config.chat.inlineImageSizeLimit) })}
                </Text>
                <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={() => { this.loadImage = true; }}>
                    <Text style={text}>{tx('button_displayThisImageAfterWarning')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    get displayImageOffer() {
        const text = {
            color: vars.bg,
            fontStyle: 'italic',
            textAlign: 'center',
            marginVertical: 10
        };
        return (
            <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={() => { this.loadImage = true; }}>
                <Text style={text}>{tx('button_displayThisImage')}</Text>
            </TouchableOpacity>
        );
    }

    get updateSettingsOffer() {
        const text = {
            color: vars.txtDate,
            fontStyle: 'italic',
            marginBottom: 4
        };
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingTop: 2, marginRight: 4 }}>
                    {icons.coloredAsText('check-circle', vars.snackbarBgGreen, 14)}
                </View>
                <Text style={text}>
                    <T k="title_updateSettingsAnyTime">{toSettingsParser}</T>
                </Text>
            </View>
        );
    }

    renderThrow() {
        const { image } = this.props;
        const { name, title, description, fileId, downloading /* , length, oversized */ } = image;
        const { width, height, loaded, showUpdateSettingsLink } = this;
        const { source } = this.cachedImage || {};
        const isLocal = !!fileId;
        if (!clientApp.uiUserPrefs.externalContentConsented && !isLocal) {
            return <InlineUrlPreviewConsent />;
        }

        // console.debug(`received source: ${width}, ${height}, ${JSON.stringify(source)}`);
        const outer = {
            padding: this.outerPadding,
            borderColor: vars.lightGrayBg,
            borderWidth: 1,
            marginVertical: 4
        };

        const header = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: !downloading && this.opened ? 10 : 0
        };

        const text = {
            flexGrow: 1,
            flexShrink: 1,
            fontWeight: 'bold',
            color: vars.txtMedium
        };

        const titleText = {
            color: vars.bg,
            marginVertical: 2
        };

        const descText = {
            color: vars.txtDark,
            marginBottom: 2
        };

        const inner = {
            backgroundColor: loaded ? vars.white : vars.lightGrayBg
        };
        return (
            <View>
                <View style={outer} onLayout={this.layout}>
                    <View>
                        {!!title && <Text style={titleText}>{title}</Text>}
                        {!!description && <Text style={descText}>{description}</Text>}
                    </View>
                    <View style={header}>
                        {!!name && <Text style={text}>{name}</Text>}
                        {isLocal && <View style={{ flexDirection: 'row' }}>
                            {!downloading && icons.darkNoPadding(this.opened ? 'arrow-drop-up' : 'arrow-drop-down', () => { this.opened = !this.opened; })}
                            {!downloading && icons.darkNoPadding('more-vert', () => this.props.onAction(this.props.image))}
                            {downloading && <ActivityIndicator />}
                        </View>}
                    </View>
                    <View style={inner}>
                        {!downloading && this.opened && this.loadImage && width && height ?
                            <Image onLoad={() => { this.loaded = true; }} source={source} style={{ width, height }} /> : null}
                        {this.opened && !this.loadImage && !this.tooBig && this.displayImageOffer}
                        {this.opened && !this.loadImage && this.tooBig && this.displayTooBigImageOffer}
                    </View>
                </View>
                {showUpdateSettingsLink && this.updateSettingsOffer}
            </View>
        );
    }
}
