import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when, reaction } from 'mobx';
import { View, Image, Text, LayoutAnimation, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import InlineUrlPreviewConsent from './inline-url-preview-consent';
import inlineImageCacheStore from './inline-image-cache-store';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import settingsState from '../settings/settings-state';
import { clientApp } from '../../lib/icebear';
import { T } from '../utils/translator';
import FileMultiInlineImageContainer from './file-multi-image-container';

const outer = {
    padding: 8,
    borderColor: vars.lightGrayBg,
    borderWidth: 1,
    marginVertical: 4
};

const header = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: this.opened ? 10 : 0
};

const text = {
    fontWeight: 'bold',
    color: vars.txtMedium
};

const settingsText = {
    color: vars.txtDate,
    fontStyle: 'italic',
    marginBottom: 4
};

const toSettings = content => (
    <Text
        onPress={() => {
            settingsState.transition('preferences');
            settingsState.transition('display');
        }}
        style={{ textDecorationLine: 'underline' }}>
        {content}
    </Text>
);

const toSettingsParser = { toSettings };

@observer
export default class FileMultiInlineImage extends SafeComponent {
    @observable opened;
    @observable loadImages;
    @observable showUpdateSettingsLink;
    cachedImages;
    imageCount;

    componentWillMount() {
        reaction(() => clientApp.uiUserPrefs.externalContentConsented, () => {
            this.showUpdateSettingsLink = true;
        });

        // TODO Uncomment
        // this.opened = clientApp.uiUserPrefs.peerioContentEnabled;
        // TODO Remove
        this.opened = true;

        const { images } = this.props;
        this.imageCount = images.length;

        this.cachedImages = images.map(
            (image) => when(() => image.cached || image.tmpCached,
            () => { return (inlineImageCacheStore.getImage(image.tmpCachePath)); }
        ));
        console.log(this.cachedImages);

        // TODO doesn't work without SDK
        // images.forEach((image) => {
        //     if (!image.cached && !image.tmpCached) {
        //         when(() => this.loadImages, () => image.tryToCacheTemporarily());
        //     }
        // });

        // TODO Remove Cache Mocks
        images.forEach((image) => {
            if (!image.cached && !image.tmpCached) {
                when(() => this.loadImages, () => {
                    image.cachePath = 'file:///storage/emulated/0/DCIM/Camera/IMG_20170928_195300.jpg';
                    image.cached = true;
                    image.tmpCachePath = 'file:///storage/emulated/0/DCIM/Camera/IMG_20170928_195300.jpg';
                    image.tmpCached = true;
                });
            }
        });

        // TODO Uncomment
        // this.loadImages = clientApp.uiUserPrefs.peerioContentEnabled;
        // TODO Remove
        this.loadImages = true;
    }

    componentDidMount() {
        reaction(() => this.opened, () => LayoutAnimation.easeInEaseOut());
    }

    renderInner() {
    }

    get updateSettingsOffer() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingTop: 2, marginRight: 4 }}>
                    {icons.coloredAsText('check-circle', vars.snackbarBgGreen, 14)}
                </View>
                <Text style={settingsText}>
                    <T k="title_updateSettingsAnyTime">{toSettingsParser}</T>
                </Text>
            </View>
        );
    }

    renderThrow() {
        // Assume downloaded
        const downloading = false;

        const name = this.props.name;

        const { showUpdateSettingsLink } = this;

        return (
            <View>
                <View style={outer} onLayout={this.layout}>
                    <View style={header}>
                        {!!name && <Text style={text}>{name} +{this.imageCount}</Text>}
                        {<View style={{ flexDirection: 'row' }}>
                            {!downloading && icons.darkNoPadding(this.opened
                                ? 'arrow-drop-up'
                                : 'arrow-drop-down'
                                , () => { this.opened = !this.opened; }
                            )}
                            {!downloading && icons.darkNoPadding('more-vert',
                            () => this.props.onAction(this.props.image))}
                            {downloading && <ActivityIndicator />}
                        </View>}
                    </View>
                    {!downloading && this.opened && this.loadImages ?
                        <FileMultiInlineImageContainer
                            cachedImages={this.cachedImages}
                        />
                    : null }
                    {showUpdateSettingsLink && this.updateSettingsOffer}
                </View>
            </View>
        );
    }
}
