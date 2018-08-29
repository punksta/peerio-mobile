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

const zeroStateImage = require('../../assets/zero_chat_state/zero-state.png');

const container = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
};

const textStyle = {
    color: vars.textBlack87,
    textAlign: 'center',
    paddingHorizontal: vars.spacing.large.maxi2x
};

const chatHeaderStyle = {
    fontSize: vars.font.size.huge,
    marginTop: vars.spacing.medium.maxi2x
};

const chatDescriptionStyle = {
    fontSize: vars.font.size.normal,
    marginVertical: vars.spacing.medium.midi
};

const imageStyle = {
    width: Dimensions.get('window').width,
    height: 275,
    paddingHorizontal: vars.spacing.medium.midi2x,
    marginBottom: vars.spacing.medium.maxi2x
};

@observer
export default class ChatZeroStatePlaceholder extends SafeComponent {
    get moreDetails() {
        if (false) {
            return buttons.roundBlueBgButton('title_syncAddressBook', () => console.log('sync'));
        }
        return (
            <View>
                <Text style={textStyle}>
                    {tx('button_createRooms')}
                </Text>
                <Text style={textStyle}>
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
                        {tx('title_headerZeroState')}
                    </Text>
                    <Text style={[textStyle, chatDescriptionStyle]}>
                        {tx('title_descriptionZeroState')}
                    </Text>
                    <Image
                        source={zeroStateImage}
                        resizeMode="contain"
                        style={imageStyle} />
                    { this.moreDetails }
                </ViewWithDrawer>
            </View>
        );
    }
}
