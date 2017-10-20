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
import { clientApp } from '../../lib/icebear';
import { T } from '../utils/translator';

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
export default class FileMultiInlineImage extends SafeComponent {
    @observable opened;
    @observable loaded;
    @observable loadImage;
    @observable showUpdateSettingsLink;
    @observable cachedImage;
    imageCount;

    componentWillMount() {
        reaction(() => clientApp.uiUserPrefs.externalContentConsented, () => {
            this.showUpdateSettingsLink = true;
        });
        this.opened = clientApp.uiUserPrefs.peerioContentEnabled;

        // TODO when Paul replies
        // Need this for loading large images
        // All images need to be cached
        // when(() => this.cachedImage, () => this.fetchSize());

        // Array of images
        const { images } = this.props;
        this.imageCount = images.length;
        const extraImages = this.imageCount < 4 ? 0 : this.imageCount - 4;
        console.log(`Image count: ${this.imageCount}`);

        // Apply on all images
        // when(() => image.cached || image.tmpCached, () => {
        //     this.cachedImage = inlineImageCacheStore.getImage(image.tmpCachePath);
        // });
        // if (!image.cached && !image.tmpCached) {
        //     when(() => this.loadImage, () => image.tryToCacheTemporarily());
        // }
        // this.loadImage = clientApp.uiUserPrefs.peerioContentEnabled;
    }

    componentDidMount() {
        reaction(() => this.opened, () => LayoutAnimation.easeInEaseOut());
    }

    renderInner() {
    }

    get updateSettingsOffer() {
        const settingsText = {
            color: vars.txtDate,
            fontStyle: 'italic',
            marginBottom: 4
        };
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
        // Assume loaded
        const loaded = true;
        // Assume downloaded
        const downloading = false;

        const { images, name } = this.props;
        console.log(images);

        // Load individually async
        // const { loaded, showUpdateSettingsLink } = this;
        const { showUpdateSettingsLink } = this;

        // All images must have a cache and a source
        // const { source } = this.cachedImage || {};

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
                    {!downloading && this.opened && this.loaded ?
                    this.multiImageContainer(this.images)
                    : null }
                    {showUpdateSettingsLink && this.updateSettingsOffer}
                </View>
            </View>
        );
    }

    // 4 cases: imageCount = 2, 3, 4, 4+
    multiImageContainer(images) {
        console.log(this.images);
        // Assume downloaded
        const downloading = false;

        const inner = {
            backgroundColor: vars.lightGrayBg
        };

        const innerDark = {
            backgroundColor: 'darkgray'
        };

        const innerLeft = {
            marginRight: 16
        };

        function dualImageRow(isTopRow, moreThanFour = false) {
            let firstIndex, secondIndex;
            if (isTopRow) {
                firstIndex = 0;
                secondIndex = 1;
            } else {
                firstIndex = 2;
                secondIndex = 3;
            }

            console.log('dualImageRow: called');
            console.log(`isTopRow: ${isTopRow}`);
            console.log(`moreThanFour: ${moreThanFour}`);
            console.log(`downloading: ${downloading}`);
            console.log(`opened: ${this.opened}`);
            console.log(`loaded: ${this.loaded}`);
            console.log(`images[firstIndex].source: ${images[firstIndex].source}`);
            console.log(`images[secondIndex].source: ${images[secondIndex].source}`);

            return (
                <View>
                    <View style={[inner, innerLeft]}>
                        {!downloading && this.opened && this.loaded ?
                            <Image
                            source={images[firstIndex].source}
                            style={{ height: 128, width: 128 }}
                            /> : null
                        }
                    </View>
                    {moreThanFour ?
                        <View style={innerDark}>
                            <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {this.imageCount}
                            </Text>
                        </View>
                    :
                        <View style={inner}>
                            {!downloading && this.opened && this.loaded ?
                                <Image
                                source={images[secondIndex].source}
                                style={{ height: 128, width: 128 }}
                                /> : null
                            }
                        </View>}
                </View>
            );
        }

        function singleImageRow() {
            return (
                <View style={[inner, innerLeft]}>
                    {!downloading && this.opened && this.loaded ?
                        <Image
                        source={images[3].source}
                        style={{ height: 128, width: 128 }}
                        /> : null
                    }
                </View>
            );
        }

        const imageCount = images.length;
        if (imageCount === 2) {
            console.log('2 images');
            return dualImageRow(true);
        } else if (imageCount === 3) {
            console.log('3 images');
            return (
                <View>
                    {dualImageRow(true)}
                    {singleImageRow()}
                </View>
            );
        } else if (imageCount === 4) {
            console.log('4 images');
            return (
                <View>
                    {dualImageRow(true)}
                    {dualImageRow(false)}
                </View>
            );
        }
        // More than 4 images
        console.log('4+ images');
        return (
            <View>
                {dualImageRow(true)}
                {dualImageRow(false, true)}
            </View>
        );
    }
}
