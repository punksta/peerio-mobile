import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import buttons from '../helpers/buttons';
import routes from '../routes/routes';
import ViewWithDrawer from '../shared/view-with-drawer';
import drawerState from '../shared/drawer-state';
// import { uiState } from '../states';

const redArrowSrc = require('../../assets/zero_chat_state/arrow-red.png');
const zeroStateImage = require('../../assets/zero_chat_state/zero-state.png');

const container = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center'
};

const wrapper = {
    flex: 1,
    flexGrow: 1
};

const chatHeaderStyle = {
    color: vars.textBlack87,
    fontSize: vars.font.size.huge,
    textAlign: 'center',
    marginTop: vars.spacing.medium.maxi2x,
    marginBottom: vars.spacing.medium.mini2x
};

const chatDescriptionStyle = {
    textAlign: 'center',
    color: vars.textBlack54,
    fontSize: vars.font.size.bigger,
    width: 250,
    marginBottom: vars.spacing.large.midixx
};

const contactDescriptionStyle = {
    color: vars.textBlack54,
    fontSize: vars.font.size.normal,
    marginTop: vars.spacing.huge.midi2x,
    marginBottom: vars.spacing.medium.mini2x
};


@observer
export default class ChatZeroStatePlaceholder extends SafeComponent {
    get headerText() {
        return (
            <Text style={chatHeaderStyle} {...testLabel('title_headerZeroState')}>
                {tx('title_headerZeroState')}
            </Text>
        );
    }

    get title() {
        return (
            <View>
                {this.headerText}
                {!drawerState.getDrawer(drawerState.DRAWER_CONTEXT.CHATS) && <Image
                    source={redArrowSrc}
                    style={{
                        width: vars.isDeviceScreenBig ? vars.iconSizeHuge : vars.iconSizeLarge2x,
                        height: vars.isDeviceScreenBig ? vars.iconSizeHuge : vars.iconSizeLarge2x,
                        position: 'absolute',
                        right: vars.iconPadding
                    }}
                />}
            </View>
        );
    }

    get chatUI() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={chatDescriptionStyle}>
                    {tx('title_descriptionZeroState')}
                </Text>
                <Image
                    source={zeroStateImage}
                    style={{
                        width: vars.chatZeroStateImageWidth,
                        height: vars.chatZeroStateImageHeight
                    }}
                />
            </View>);
    }

    get findContactsButton() {
        return (
            buttons.roundBlueBgButton('title_findContactsZeroState', () => routes.main.contactAdd())
        );
    }

    get contactUI() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={contactDescriptionStyle}>
                    {tx('title_seeWhoYouAlreadyKnow')}
                </Text>
                {this.findContactsButton}
            </View>);
    }

    get defaultZeroState() {
        return (
            <ViewWithDrawer style={wrapper} alwaysBounceVertical={false}>
                {this.title}
                {this.chatUI}
                {this.contactUI}
            </ViewWithDrawer>
        );
    }

    get firstLoginZeroState() {
        // TODO get correct illustration
        const firstLoginZeroStateImage = require('../../assets/zero_chat_state/zero-state.png');
        const firstLoginStyle = {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: vars.spacing.huge.maxi2x,
            right: 0,
            left: 0
        };
        const imageStyle = {
            flexGrow: 1,
            height: null,
            width: null,
            alignItems: 'center',
            justifyContent: 'center'
        };
        return (
            <ViewWithDrawer style={wrapper}>
                <View style={firstLoginStyle}>
                    <Image source={firstLoginZeroStateImage} style={imageStyle}>
                        <Text style={{ textAlign: 'center' }}>{tx('title_zeroFirstLoginMessage')}</Text>
                    </Image>
                </View>
            </ViewWithDrawer>
        );
    }

    renderThrow() {
        return (
            <View style={container}>
                {/* {uiState.isFirstLogin ? this.firstLoginZeroState : this.defaultZeroState} */}
                {this.defaultZeroState}
            </View>
        );
    }
}
