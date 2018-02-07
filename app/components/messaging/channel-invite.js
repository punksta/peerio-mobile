import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { invitationState } from '../states';
import buttons from '../helpers/buttons';
import ButtonText from '../controls/button-text';
import BackIcon from '../layout/back-icon';
import { chatInviteStore, contactStore } from '../../lib/icebear';
import routerMain from '../routes/router-main';
import chatState from './chat-state';
import AvatarCircle from '../shared/avatar-circle';

const headingStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    fontSize: vars.font.size.bigger,
    lineHeight: 22
};

const headingSection = {
    paddingTop: 116,
    flex: 0.6
};

const sectionLine = {
    marginHorizontal: vars.spacing.medium.mini2x,
    borderWidth: 1,
    borderColor: vars.black12
};

const infoSection = {
    paddingTop: vars.spacing.medium.mini2x,
    flex: 0.4,
    alignItems: 'center'
};

const infoStyle = {
    color: vars.subtleText,
    fontSize: vars.font.size.normal,
    textAlign: 'center'
};

const buttonContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.medium.mini2x,
    justifyContent: 'center'
};

@observer
export default class ChannelInvite extends SafeComponent {
    get invitation() { return invitationState.currentInvitation; }

    @action.bound acceptInvite() {
        chatInviteStore.acceptInvite(this.invitation.id);
        chatState.routerMain.chats(this.invitation.id);
    }

    @action.bound declineInvite() {
        chatInviteStore.rejectInvite(this.invitation.id);
        routerMain.chats();
    }

    get leftIcon() { return <BackIcon action={routerMain.chats} />; }

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                <View style={headingSection}>
                    <Text style={headingStyle}>
                        {tx('title_roomInviteHeading')}
                    </Text>
                    <Text style={[headingStyle, { fontWeight: vars.font.weight.bold }]}>
                        #{this.invitation.channelName}
                    </Text>
                    <View style={buttonContainer}>
                        <ButtonText
                            text="Decline"
                            onPress={this.declineInvite}
                            testID="decline"
                            textColor={vars.bgGreen}
                            style={{ width: vars.roundedButtonWidth, textAlign: 'center' }}
                        />
                        {buttons.uppercaseGreenBgButton(tx('button_accept'), this.acceptInvite)}
                    </View>
                </View>
                <View style={sectionLine} />
                <View style={infoSection}>
                    <Text style={infoStyle}>
                        {tx('title_hostedBy')}
                    </Text>
                    <AvatarCircle
                        contact={contactStore.getContact(this.invitation.username)}
                    />
                </View>
            </View>);
    }
}
