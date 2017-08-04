import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { observable } from 'mobx';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import Avatar from '../shared/avatar';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { popupCancelConfirm } from '../shared/popups';

const textStyle = {
    color: vars.txtDate,
    marginTop: 10,
    fontSize: 12,
    marginLeft: 18,
    fontWeight: 'bold'
};

const leaveTitle = 'Leave Channel!';
const leaveMessage =
`If you wish to leave, you will no longer be able to access the shared files and chat history
To rejoin this channel, please ask the admin to add you again`;

const deleteTitle = 'Delete Channel!';
const deleteMessage =
`If you delete the channel, you will no longer be able to access the shared files and chat history`;

@observer
export default class ChannelInfo extends SafeComponent {
    @observable channelTopic = '';
    @observable chat = null;

    componentDidMount() {
        this.chat = chatState.currentChat;
        this.channelTopic = this.chat.purpose;
    }

    leaveChannel = async () => {
        if (await popupCancelConfirm(leaveTitle, leaveMessage)) {
            await this.chat.leave();
            chatState.routerModal.discard();
        }
    }

    deleteChannel = async () => {
        if (await popupCancelConfirm(deleteTitle, deleteMessage)) {
            await this.chat.delete();
            chatState.routerModal.discard();
        }
    }

    lineBlock(content, noBorder) {
        const s = {
            borderBottomWidth: noBorder ? 0 : 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    action(title, icon, action) {
        return (
            <TouchableOpacity pressRetentionOffset={vars.retentionOffset} onPress={action}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {icons.dark(icon, action)}
                    <Text>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    participant = (contact, i) => {
        const { chat } = this;
        const { username } = contact;
        const row = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1
        };
        const isAdmin = chatState.currentChat.isAdmin(contact);
        return (
            <View key={contact.username} style={row}>
                <View style={{ flex: 1, flexGrow: 1, paddingLeft: 4 }}>
                    <Avatar
                        noBorderBottom
                        contact={contact}
                        key={username || i}
                        message={''}
                        hideOnline />
                </View>
                <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                    {isAdmin && <View style={{ backgroundColor: vars.bg, borderRadius: 4, padding: 4, overflow: 'hidden' }}>
                        <Text style={{ color: vars.white, fontSize: 10 }}>ADMIN</Text>
                    </View>}
                    <Menu>
                        <MenuTrigger
                            renderTouchable={() => <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} />}
                            style={{ padding: vars.iconPadding }}>
                            {icons.plaindark('more-vert')}
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption
                                onSelect={() => isAdmin ?
                                    chat.removeAdmin(contact) :
                                    chat.addAdmin(contact)}>
                                <Text>{isAdmin ? 'Remove admin' : 'Make admin'}</Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => chat.removeParticipant(contact)}>
                                <Text>Remove</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        );
    }

    topicTextBox() {
        const chat = chatState.currentChat;
        const update = () => {
            chat.changePurpose(this.channelTopic);
        };
        return (
            <View>
                <Text style={textStyle}>Topic</Text>
                <TextInput
                    onChangeText={text => (this.channelTopic = text)}
                    onBlur={update}
                    onEndEditing={update}
                    value={this.channelTopic}
                    style={{ paddingLeft: 18, height: vars.inputHeight, color: vars.txtDark }} />
            </View>
        );
    }

    renderThrow() {
        const chat = chatState.currentChat;
        const body = (
            <View>
                {this.lineBlock(this.topicTextBox())}
                {this.lineBlock(this.action('Leave channel', 'remove-circle-outline', this.leaveChannel), true)}
                {/* this.lineBlock(this.action('Mute channel',
                        chat.isMuted ? 'notifications-off' : 'notifications-none',
                        () => chat.toggleMuted())) */}
                {this.lineBlock(this.action('Delete channel', 'delete', this.deleteChannel))}
                {chat.participants && this.lineBlock(
                    <View style={{ paddingVertical: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                            <Text style={[textStyle, { marginBottom: 12 }]}>Members</Text>
                            {icons.dark('add-circle-outline', () => chatState.routerModal.channelAddPeople())}
                        </View>
                        {chat.participants.map(this.participant)}
                    </View>
                )}
            </View>
        );
        const rightIcon = chat.isFavorite ?
            icons.gold('star', () => chat.toggleFavoriteState()) :
            icons.dark('star-border', () => chat.toggleFavoriteState());
        return (<LayoutModalExit
            body={body}
            title={`# ${chat.name}`}
            rightIcon={rightIcon}
            onClose={() => chatState.routerModal.discard()} />);
    }
}
