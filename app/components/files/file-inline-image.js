import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when, reaction, action } from 'mobx';
import { View, Image, Text, Dimensions, LayoutAnimation, TouchableOpacity, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Progress from '../shared/progress';
import FileProgress from './file-progress';
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

const forceShowMap = observable.map();

const toSettingsParser = { toSettings };

@observer
export default class FileInlineImage extends SafeComponent {
    @observable cachedImage;
    @observable width = 0;
    @observable height = 0;
    @observable optimalContentWidth = 0;
    @observable optimalContentHeight = 0;
    @observable opened;
    @observable loaded;
    // image is a bit big but we still can display it manually
    @observable tooBig;
    // image is too big to be displayed
    @observable oversizeCutoff;
    // force loading image
    @observable loadImage;
    @observable showUpdateSettingsLink;
    @observable handleLoadingTimeout;
    // set this to true when we have network download problems
    @observable downloadError;
    // set this to true, when we have decoding problems
    @observable errorDisplayingImage;
    @observable loadedBytesCount = 0;
    @observable totalBytesCount = 0;
    outerPadding = 8;

    componentWillMount() {
        this.optimalContentHeight = Dimensions.get('window').height;
        when(() => this.cachedImage, () => this.fetchSize());
        const { image } = this.props;
        const { fileId, url, isOverInlineSizeLimit, isOversizeCutoff, tmpCachePath } = image;
        this.tooBig = isOverInlineSizeLimit || isOversizeCutoff;
        this.oversizeCutoff = isOversizeCutoff;
        this.loadImage = forceShowMap.get(url || fileId);
        if (fileId) {
            // we have local inline file
            when(() => clientApp.uiUserPrefs.peerioContentEnabled, () => { this.opened = true; });
            if (!this.loadImage) {
                when(() => clientApp.uiUserPrefs.peerioContentEnabled && !this.tooBig && !this.oversizeCutoff,
                    () => { this.loadImage = true; });
            }
            when(() => image.tmpCached, () => {
                this.cachedImage = inlineImageCacheStore.getImage(tmpCachePath);
            });
            if (!image.tmpCached) {
                when(() => this.loadImage, async () => {
                    if (await config.FileStream.exists(tmpCachePath)) {
                        image.tmpCached = true;
                        return;
                    }
                    image.tryToCacheTemporarily(true);
                });
            }
        } else {
            // we have external url
            when(() => clientApp.uiUserPrefs.externalContentConsented && clientApp.uiUserPrefs.externalContentEnabled,
                () => { this.loadImage = true; });
            this.opened =
                clientApp.uiUserPrefs.externalContentConsented && clientApp.uiUserPrefs.externalContentEnabled;
            when(() => this.loadImage, () => {
                this.cachedImage = inlineImageCacheStore.getImage(url);
                this.opened = true;
                this.handleLoadStart();
            });
        }
    }

    forceShow = () => {
        this.loadImage = true;
        const { url, fileId } = this.props.image;
        forceShowMap.set(url || fileId, true);
    }

    fetchSize() {
        const { cachedImage } = this;
        // if width or height is undefined, there was an error loading it
        when(() => cachedImage.width !== undefined && cachedImage.height !== undefined && this.optimalContentWidth, () => {
            const { width, height } = cachedImage;
            const { optimalContentWidth, optimalContentHeight } = this;
            if (width <= 0 && height <= 0) this.onErrorLoadingImage();
            Object.assign(this, vars.optimizeImageSize(width, height, optimalContentWidth, optimalContentHeight));
            // console.debug(`calculated width: ${this.width}, ${this.height}`);
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
                <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={this.forceShow}>
                    <Text style={text}>{tx('button_displayThisImageAfterWarning')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    get displayCutOffImageOffer() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark
        };
        return (
            <View style={outer}>
                <Text style={text0}>
                    {tx('title_imageTooBigCutoff', { size: util.formatBytes(config.chat.inlineImageSizeLimitCutoff) })}
                </Text>
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

    get downloadErrorMessage() {
        const outer = {
            padding: this.outerPadding,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            justifyContent: 'center'
        };
        const textStyle = {
            color: vars.txtDark,
            backgroundColor: 'transparent',
            textAlign: 'center'
        };
        return (
            <View style={outer}>
                <Text style={textStyle}>
                    {tx('title_poorConnectionExternalURL')}
                </Text>
            </View>
        );
    }

    @action.bound handleLoadStart() {
        this.loadingTimeoutId = setTimeout(() => {
            console.log('loading timeout');
            // this.handleLoadingTimeout();
            this.downloadError = true;
        }, vars.loadingTimeout);
    }

    @action.bound handleLoadingTimeout() {
        console.log('handle loading timeout');
        // this.downloadError = true;
    }

    @action.bound handleLoadEnd() {
        if (this.loadingTimeoutId) {
            clearTimeout(this.loadingTimeoutId);
            this.loadingTimeoutId = null;
        }
    }

    @action.bound handleProgress(e) {
        const { loaded, total } = e.nativeEvent;
        this.loadedBytesCount = loaded;
        this.totalBytesCount = total;
    }

    onLoad = () => {
        this.loaded = true;
    }

    onErrorLoadingImage = () => {
        this.errorDisplayingImage = true;
    }

    get displayErrorMessage() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark,
            backgroundColor: vars.lightGrayBg,
            paddingVertical: vars.spacing.large.midi2x,
            textAlign: 'center',
            paddingHorizontal: vars.spacing.small.maxi
        };
        return (
            <View style={outer}>
                <Text style={text0}>
                    {tx('error_loadingImage')}
                </Text>
            </View>
        );
    }

    renderThrow() {
        const { image } = this.props;
        const { name, title, description, fileId, downloading } = image;
        const { width, height, loaded, showUpdateSettingsLink } = this;
        const { source, acquiringSize } = this.cachedImage || {};
        const isLocal = !!fileId;
        if (!clientApp.uiUserPrefs.externalContentConsented && !isLocal) {
            return <InlineUrlPreviewConsent onChange={() => { this.showUpdateSettingsLink = true; }} />;
        }

        const outer = {
            padding: this.outerPadding,
            borderColor: vars.lightGrayBg,
            borderWidth: 1,
            marginVertical: 4,
            borderRadius: 2
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
            color: vars.txtMedium,
            textAlignVertical: 'top',
            lineHeight: 25
        };

        const titleText = {
            color: vars.bg,
            marginVertical: 2,
            ellipsizeMode: 'tail'
        };

        const descText = {
            color: vars.txtDark,
            marginBottom: 2
        };

        const inner = {
            backgroundColor: loaded ? vars.white : vars.lightGrayBg,
            minHeight: loaded ? undefined : 140,
            justifyContent: 'center'
        };

        return (
            <View>
                <View style={outer} onLayout={this.layout}>
                    <View>
                        {!!title && <Text style={titleText}>{title}</Text>}
                        {!!description && <Text style={descText}>{description}</Text>}
                    </View>
                    <View style={header}>
                        {!!name && <Text numberOfLines={1} ellipsizeMode="tail" style={text}>{name}</Text>}
                        {isLocal && <View style={{ flexDirection: 'row' }}>
                            {!downloading && icons.darkNoPadding(
                                this.opened ? 'arrow-drop-up' : 'arrow-drop-down',
                                () => { this.opened = !this.opened; },
                                { marginHorizontal: vars.spacing.small.maxi2x }
                            )}
                            {!downloading && icons.darkNoPadding(
                                'more-vert',
                                () => this.props.onAction(this.props.image),
                                { marginHorizontal: vars.spacing.small.maxi2x }
                            )}
                        </View>}
                    </View>
                    {this.opened &&
                        <View style={inner}>
                            {!downloading && this.loadImage && width && height ?
                                <Image
                                    onProgress={this.handleProgress}
                                    onLoadEnd={this.handleLoadEnd}
                                    onLoad={this.onLoad}
                                    onError={this.onErrorLoadingImage}
                                    source={{ uri: source.uri, width, height }}
                                    style={{ width, height }}
                                /> : null }
                            {!this.loadImage && !this.tooBig && this.displayImageOffer}
                            {!this.loadImage && this.tooBig && !this.oversizeCutoff && this.displayTooBigImageOffer}
                            {this.oversizeCutoff && this.displayCutOffImageOffer}
                            {!this.loaded && this.downloadError && this.downloadErrorMessage}
                            {this.errorDisplayingImage && this.displayErrorMessage}
                            {acquiringSize && !this.downloadError && <ActivityIndicator />}
                            {this.totalBytesCount > 0 && <Progress max={this.totalBytesCount} value={this.loadedBytesCount} />}
                            <View style={{ alignSelf: 'flex-end' }}>
                                {isLocal && <FileProgress file={image} />}
                            </View>
                        </View>}
                </View>
                {!isLocal && showUpdateSettingsLink && this.updateSettingsOffer}
            </View>
        );
    }
}
