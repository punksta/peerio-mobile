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

        const images = this.props.images;
        const name = this.props.name;
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
                    {!downloading && this.opened && loaded ?
                    this.multiImageContainer(images)
                    : null }
                    {showUpdateSettingsLink && this.updateSettingsOffer}
                </View>
            </View>
        );
    }

    // 4 cases: imageCount = 2, 3, 4, 4+
    multiImageContainer(images) {
        console.log(images);
    
        // Assume downloaded, opened, loaded
        const downloading = false;
        const opened = true;
        const loaded = true;

        const square = {
            height: 128,
            width: 128
        };

        const inner = {
            backgroundColor: vars.lightGrayBg,
            borderRadius: 4
        };

        const innerDark = {
            backgroundColor: '#9d9d9d',
            borderRadius: 4
        };

        const innerLeft = {
            marginRight: 15
        };

        const imageNumContainer = {
            justifyContent: 'center',
            alignItems: 'center'
        };

        const imageNumText = {
            fontSize: 24,
            fontWeight: '600',
            color: 'white'
        };

        function dualImageRow(isTopRow, moreThanFour = false) {
            const bottomRow = {
                flexDirection: 'row',
                marginTop: isTopRow ? 0 : 8
            };

            let firstIndex, secondIndex;
            if (isTopRow) {
                firstIndex = 0;
                secondIndex = 1;
            } else {
                firstIndex = 2;
                secondIndex = 3;
            }

            return (
                <View style={bottomRow}>
                    <View style={[inner, innerLeft]}>
                        {!downloading && opened && loaded ?
                            <Image
                            source={images[firstIndex].source}
                            style={square}
                            /> : null
                        }
                    </View>
                    {moreThanFour ?
                        <View style={[innerDark, square, imageNumContainer]}>
                            <Text style={imageNumText}>
                                +{images.length - 4}
                            </Text>
                        </View>
                    :
                        <View style={inner}>
                            {!downloading && opened && loaded ?
                                <Image
                                    source={images[secondIndex].source}
                                    style={square}
                                /> : null
                            }
                        </View>}
                </View>
            );
        }

        function singleImageRow() {
            return (
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <View style={[inner, innerLeft]}>
                        {!downloading && opened && loaded ?
                            <Image
                                source={images[2].source}
                                style={square}
                            /> : null
                        }
                    </View>
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
