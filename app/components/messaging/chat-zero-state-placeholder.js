import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import buttons from '../helpers/buttons';
import ViewWithDrawer from '../shared/view-with-drawer';
import { uiState } from '../states';
import routes from '../routes/routes';

const zeroStateImage = require('../../assets/zero_chat_state/zero-state.png');

const container = {
    backgroundColor: vars.darkBlueBackground05,
    flex: 1
};

const textStyle = {
    color: vars.textBlack87,
    textAlign: 'center',
    paddingHorizontal: vars.spacing.large.mini,
    paddingVertical: vars.spacing.small.mini2x
};

const chatHeaderStyle = {
    fontSize: vars.font.size.huge,
    paddingTop: vars.spacing.medium.maxi2x,
    paddingHorizontal: vars.spacing.large.maxi
};

const chatDescriptionStyle = {
    fontSize: vars.font.size.normal,
    marginVertical: vars.spacing.medium.mini,
    paddingHorizontal: vars.spacing.large.maxi
};

const imageStyle = {
    width: Dimensions.get('window').width,
    height: 255,
    paddingHorizontal: vars.spacing.medium.midi2x,
    marginBottom: vars.spacing.small.midi2x
};

const syncStyle = {
    marginTop: vars.spacing.large.maxi2x
};

@observer
export default class ChatZeroStatePlaceholder extends SafeComponent {
    sync() {
        uiState.isFirstLogin = false;
        routes.modal.contactSync();
    }

    get moreDetails() {
        if (uiState.isFirstLogin) {
            return buttons.roundBlueBgButton('title_syncAddressBook', this.sync, false, null, syncStyle);
        }
        return (
            <View>
                <Text bold style={[{ fontSize: vars.font.size.big }, textStyle]}>
                    {tx('button_createRooms')}
                </Text>
                <Text semibold style={[{ fontSize: vars.font.size.bigger }, textStyle]}>
                    {tx('title_roomsDescription1')}
                </Text>
                <Text style={textStyle}>
                    {tx('title_roomsDescription2')}
                </Text>
                <Text style={textStyle}>
                    {tx('title_roomsDescription3')}
                </Text>
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={container}>
                <ViewWithDrawer>
                    <Text bold style={[textStyle, chatHeaderStyle]} {...testLabel('title_headerZeroState')}>
                        {tx('title_zeroChat')}
                    </Text>
                    <Text style={[textStyle, chatDescriptionStyle]}>
                        {tx('title_zeroChatSubtitle')}
                    </Text>
                    <Image
                        source={zeroStateImage}
                        resizeMode="contain"
                        style={imageStyle} />
                    {this.moreDetails}
                </ViewWithDrawer>
            </View>
        );
    }
}
