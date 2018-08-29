import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import buttons from '../helpers/buttons';
import routes from '../routes/routes';
import ViewWithDrawer from '../shared/view-with-drawer';

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
    color: vars.textBlack87,
    fontSize: vars.font.size.bigger,
    paddingHorizontal: vars.spacing.medium.maxi2x,
    marginBottom: vars.spacing.large.midi
};

const contactDescriptionStyle = {
    color: vars.textBlack54,
    fontSize: vars.font.size.normal,
    marginTop: vars.spacing.huge.midi2x,
    marginBottom: vars.spacing.medium.mini2x
};

const { width } = Dimensions.get('window');
const imageStyle = {
    width,
    height: 275,
    paddingLeft: vars.spacing.medium.midi2x,
    paddingRight: vars.spacing.medium.midi2x
};

@observer
export default class ChatZeroStatePlaceholder extends SafeComponent {
    get title() {
        return (<View>
            <Text
                bold
                style={chatHeaderStyle}
                {...testLabel('title_headerZeroState')}
            >
                {tx('title_headerZeroState')}
            </Text>
        </View>);
    }

    get chatUI() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={chatDescriptionStyle}>
                    {tx('title_descriptionZeroState')}
                </Text>
                <Image
                    source={zeroStateImage}
                    resizeMode="contain"
                    style={imageStyle}
                />
            </View>
        );
    }

    get findContactsButton() {
        return buttons.roundBlueBgButton('title_findContactsZeroState', () =>
            routes.main.contactAdd()
        );
    }

    get contactUI() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={contactDescriptionStyle}>
                    {tx('title_seeWhoYouAlreadyKnow')}
                </Text>
                {this.findContactsButton}
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={container}>
                <ViewWithDrawer style={wrapper}>
                    {this.title}
                    {this.chatUI}
                    {this.contactUI}
                </ViewWithDrawer>
            </View>
        );
    }
}
