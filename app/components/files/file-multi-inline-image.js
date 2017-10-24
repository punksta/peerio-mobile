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
    @observable cachedImages;
    imageCount;

    componentWillMount() {
        reaction(() => clientApp.uiUserPrefs.externalContentConsented, () => {
            this.showUpdateSettingsLink = true;
        });
        // TODO Uncomment
        // this.opened = clientApp.uiUserPrefs.peerioContentEnabled;

        const { images } = this.props;
        this.imageCount = images.length;

        images.forEach((image) => when(() => image.cached || image.tmpCached,
            () => {
                this.cachedImages.push(inlineImageCacheStore.getImage(image.tmpCachePath));
                console.log('pushing image');
            }
        ));

        // TODO doesn't work without SDK
        // images.forEach((image) => {
        //     if (!image.cached && !image.tmpCached) {
        //         when(() => this.loadImages, () => image.tryToCacheTemporarily());
        //     }
        // });

        // TODO Uncomment
        // this.loadImages = clientApp.uiUserPrefs.peerioContentEnabled;

        // TODO remove below assignments: Assume opened, loadImages
        this.opened = true;
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

        const images = this.props.images;
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
                    this.multiImageContainer(images)
                    : null }
                    {showUpdateSettingsLink && this.updateSettingsOffer}
                </View>
            </View>
        );
    }

    // 4 cases: imageCount = 2, 3, 4, 4+
    multiImageContainer(images) {
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
                        <Image
                            source={images[firstIndex].source}
                            style={square}
                        />
                    </View>
                    {moreThanFour ?
                        <View style={[innerDark, square, imageNumContainer]}>
                            <Text style={imageNumText}>
                                +{images.length - 4}
                            </Text>
                        </View>
                    :
                        <View style={inner}>
                            <Image
                                source={images[secondIndex].source}
                                style={square}
                            />
                        </View>}
                </View>
            );
        }

        function singleImageRow() {
            return (
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <View style={[inner, innerLeft]}>
                        <Image
                            source={images[2].source}
                            style={square}
                        />
                    </View>
                </View>
            );
        }

        const imageCount = images.length;
        if (imageCount === 2) {
            return dualImageRow(true);
        } else if (imageCount === 3) {
            return (
                <View>
                    {dualImageRow(true)}
                    {singleImageRow()}
                </View>
            );
        } else if (imageCount === 4) {
            return (
                <View>
                    {dualImageRow(true)}
                    {dualImageRow(false)}
                </View>
            );
        }
        return (
            <View>
                {dualImageRow(true)}
                {dualImageRow(false, true)}
            </View>
        );
    }
}
