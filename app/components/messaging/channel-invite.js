import PropTypes from 'prop-types';
import React from 'react';
import { action, observable } from 'mobx';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { invitationState } from '../states';
import buttons from '../helpers/buttons';
import ButtonText from '../controls/button-text';
import BackIcon from '../layout/back-icon';
import { User, chatInviteStore, contactStore } from '../../lib/icebear';
import routerMain from '../routes/router-main';
import chatState from './chat-state';
import AvatarCircle from '../shared/avatar-circle';
import ChannelUpgradeOffer from '../channels/channel-upgrade-offer';
import ProgressOverlay from '../shared/progress-overlay';

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
    @observable waiting = false;

    get invitation() { return invitationState.currentInvitation; }

    @action.bound async acceptInvite() {
        const chatId = this.invitation.id;
        chatInviteStore.acceptInvite(chatId);
        let newChat = null;
        try {
            this.waiting = true;
            newChat = await chatState.store.getChatWhenReady(chatId);
        } catch (e) {
            console.error(e);
        }
        // if we failed to accept invite, newChat is null
        // and it just goes to the chat list
        routerMain.chats(newChat);
    }

    @action.bound declineInvite() {
        chatInviteStore.rejectInvite(this.invitation.id);
        routerMain.chats();
    }

    get leftIcon() { return <BackIcon action={routerMain.chats} />; }

    renderThrow() {
        const hasPaywall = User.current.channelsLeft <= 0;
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                {!this.waiting && hasPaywall && <ChannelUpgradeOffer />}
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
                        {buttons.uppercaseGreenBgButton(tx('button_accept'), this.acceptInvite, hasPaywall)}
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
                <ProgressOverlay enabled={this.waiting} />
            </View>);
    }
}
