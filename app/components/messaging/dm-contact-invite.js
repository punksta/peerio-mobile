import React from 'react';
import { observable, action } from 'mobx';
import { Image, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import BackIcon from '../layout/back-icon';
import routes from '../routes/routes';
import chatState from '../messaging/chat-state';
import AvatarCircle from '../shared/avatar-circle';
import ProgressOverlay from '../shared/progress-overlay';
import IdentityVerificationNotice from './identity-verification-notice';
import Text from '../controls/custom-text';

const emojiTada = require('../../assets/emoji/tada.png');

const container = {
    flex: 1,
    flexGrow: 1,
    paddingTop: vars.dmInvitePaddingTop,
    alignItems: 'center'
};

const emojiStyle = {
    alignSelf: 'center',
    width: vars.iconSizeMedium,
    height: vars.iconSizeMedium,
    marginBottom: vars.spacing.small.mini2x
};

const headingStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    fontSize: vars.font.size.bigger,
    lineHeight: 22,
    marginBottom: vars.spacing.medium.maxi
};

const buttonContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.large.midi2x,
    justifyContent: 'center'
};

@observer
export default class DmContactInvite extends SafeComponent {
    @observable waiting = false;

    get chat() { return chatState.currentChat; }

    get leftIcon() { return <BackIcon action={routes.main.chats} />; }

    @action.bound async decline() {
        this.chat.dismiss();
        routes.main.chats();
    }

    @action.bound async accept() {
        this.chat.start();
        routes.main.chats(this.chat);
    }

    renderThrow() {
        const { chat } = this;
        const inviter = chat.otherParticipants[0];
        const headingCopy = chat.isReceived ? 'title_newUserDmInviteHeading' : 'title_dmInviteHeading';
        return (
            <View style={container}>
                <Image source={emojiTada} style={emojiStyle} resizeMode="contain" />
                <Text style={headingStyle}>
                    {tx(headingCopy, { contactName: inviter.fullName })}
                </Text>
                <View style={{ alignItems: 'center' }}>
                    <AvatarCircle contact={inviter} medium />
                </View>
                <Text style={{ textAlign: 'center', marginBottom: vars.spacing.medium.maxi2x }}>
                    {inviter.usernameTag}
                </Text>
                <IdentityVerificationNotice />
                <View style={buttonContainer}>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: vars.spacing.medium.maxi2x }}>
                        {buttons.blueTextButton(tx('button_dismiss'), this.decline)}
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                        {buttons.roundBlueBgButton(tx('button_message'), this.accept)}
                    </View>
                </View>
                <ProgressOverlay enabled={this.waiting} />
            </View>);
    }
}
