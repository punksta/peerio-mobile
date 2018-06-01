import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react/native';
import { ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { t, tu } from 'peerio-translator';
import { T } from '../../utils/translator';
import Text from '../../controls/custom-text';
import SafeComponent from '../../shared/safe-component';
import { vars } from '../../../styles/styles';
import buttons from '../../helpers/buttons';
import routes from '../../routes/routes';
import icons from '../../helpers/icons';
import chatState from '../../messaging/chat-state';
import { contactStore } from '../../../lib/icebear';

const container = {
    flex: 1,
    flexGrow: 1
};

const wrapper = {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center'
};

const welcomeContainerStyle = {
    alignItems: 'center',
    margin: vars.spacing.large.midi,
    marginTop: vars.spacing.large.mini2x
};

const welcomeHeaderStyle = {
    color: vars.textBlack87,
    fontSize: vars.font.size.huge,
    fontWeight: 'bold'
};

const upgradeDescriptionStyle = {
    color: vars.textBlack87,
    fontSize: vars.font.size.bigger,
    marginBottom: vars.spacing.large.mini
};

const featureContainerStyle = {
    width: '80%',
    marginBottom: vars.spacing.large.mini2x
};

const featureContainer = {
    display: 'flex',
    flexDirection: 'row'
};

const featureStyle = {
    color: vars.textBlack54,
    fontSize: vars.font.size.bigger,
    marginBottom: vars.spacing.small.midi2x
};

const featureIcon = {
    padding: vars.spacing.small.mini,
    marginRight: vars.spacing.small.maxi2x
};

const contactDescriptionStyle = {
    color: vars.textBlack54,
    fontSize: vars.font.size.normal,
    margin: vars.spacing.medium.mini,
    textAlign: 'center'
};

const buttonContainerStyle = {
    paddingVertical: vars.spacing.medium.midi
};

const buttonStyle = {
    color: vars.textBlack38
};

const chatWithUs = {
    textDecorationLine: 'underline',
    color: vars.darkBlue
};

const mcrHelp = text => (
    <Text
        style={chatWithUs}>
        {text}
    </Text>
);

const mcrHelpParser = { mcrHelp };

@observer
export default class MedcryptorAdminScreen extends SafeComponent {
    constructor(props) {
        super(props);
        this.helpAccount = contactStore.getContact(this.helpAccountUsername);
    }

    helpAccountUsername = 'team_medcryptor';
    buyAccountUrl = 'https://medcryptor.com/';
    features = ['mcr_title_patientInvites', 'mcr_title_consultationRooms', 'mcr_title_discussionRooms'];

    contactMedcryptor = async () => {
        return chatState.startChat([this.helpAccount]);
    };

    skipScreen = () => routes.main.chats();

    renderFeature(title) {
        return (
            <View key={title} style={featureContainer}>
                <Icon
                    style={featureIcon}
                    name="arrow-forward"
                    size={vars.iconSizeSmall}
                    color={vars.textBlack54} />
                <Text style={featureStyle}>
                    {t(title)}
                </Text>
            </View>
        );
    }

    renderThrow() {
        return (
            <ScrollView style={container}>
                <View style={wrapper}>
                    <View style={welcomeContainerStyle}>
                        {icons.coloredAsText('check-circle', vars.confirmColor, 60)}
                        <Text style={welcomeHeaderStyle}>
                            {t('mcr_title_thankYou')}
                        </Text>
                    </View>
                    <View style={featureContainerStyle}>
                        <Text style={upgradeDescriptionStyle}>
                            {t('mcr_title_upgrade')}
                        </Text>
                        {this.features.map(f => this.renderFeature(f))}
                    </View>
                    {buttons.roundBlueBgButton('mcr_title_getAccount', () => Linking.openURL(this.buyAccountUrl))}
                    <TouchableOpacity
                        pressRetentionOffset={vars.pressRetentionOffset}
                        onPress={this.contactMedcryptor}>
                        <Text style={contactDescriptionStyle}>
                            <T k="mcr_title_needHelp">{mcrHelpParser}</T>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        pressRetentionOffset={vars.pressRetentionOffset}
                        onPress={this.skipScreen}
                        style={buttonContainerStyle}>
                        <Text style={buttonStyle}>
                            {tu('mcr_title_skip')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
