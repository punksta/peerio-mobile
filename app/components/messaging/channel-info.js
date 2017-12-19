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
import { tx, tu } from '../utils/translator';

const textStyle = {
    color: vars.txtDate,
    marginTop: vars.spacing.small.maxi,
    fontSize: vars.font.size.smaller,
    marginLeft: vars.spacing.medium.midi,
    fontWeight: 'bold'
};

const topicTextStyle = {
    color: vars.txtDark,
    margin: vars.spacing.medium.midi,
    fontSize: vars.font.size.normal
};

@observer
export default class ChannelInfo extends SafeComponent {
    @observable channelTopic = '';
    @observable chat = null;

    componentWillMount() {
        this.chat = chatState.currentChat;
        if (!this.chat) return;
        this.channelTopic = this.chat.purpose;
    }

    leaveChannel = async () => {
        if (await popupCancelConfirm(tx('button_leaveChannel'), tx('title_confirmChannelLeave'))) {
            await this.chat.leave();
            chatState.routerModal.discard();
        }
    }

    deleteChannel = async () => {
        if (await popupCancelConfirm(tx('button_deleteChannel'), tx('title_confirmChannelDelete'))) {
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
        const isAdmin = chat.isAdmin(contact);
        return (
            <View key={contact.username} style={row}>
                <View style={{ flex: 1, flexGrow: 1, paddingLeft: vars.spacing.small.mini2x }}>
                    <Avatar
                        noBorderBottom
                        contact={contact}
                        key={username || i}
                        message=""
                        hideOnline />
                </View>
                <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                    {isAdmin && <View style={{ backgroundColor: vars.bg, borderRadius: 4, padding: vars.spacing.small.mini2x, overflow: 'hidden' }}>
                        <Text style={{ color: vars.white, fontSize: vars.font.size.small }}>
                            {tu('title_admin')}
                        </Text>
                    </View>}
                    {chat.canIAdmin && <Menu>
                        <MenuTrigger
                            renderTouchable={() => <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} />}
                            style={{ padding: vars.iconPadding }}>
                            {icons.plaindark('more-vert')}
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption
                                onSelect={() => (isAdmin ?
                                    chat.demoteAdmin(contact) :
                                    chat.promoteToAdmin(contact))}>
                                <Text>{isAdmin ?
                                    tx('button_demoteAdmin') : tx('button_makeAdmin')}
                                </Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => chat.removeParticipant(contact)}>
                                <Text>{tx('button_remove')}</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>}
                </View>
            </View>
        );
    }

    get topicTextBox() {
        const chat = chatState.currentChat;
        const update = () => {
            chat.changePurpose(this.channelTopic);
        };
        return (
            <View>
                <Text style={textStyle}>{tx('title_channelPurpose')}</Text>
                <TextInput
                    onChangeText={text => { this.channelTopic = text; }}
                    onBlur={update}
                    onEndEditing={update}
                    value={this.channelTopic}
                    style={{ paddingLeft: vars.spacing.medium.midi, height: vars.inputHeight, color: vars.txtDark }} />
            </View>
        );
    }

    get topicTextView() {
        return (
            <View>
                <Text style={textStyle}>{tx('title_channelPurpose')}</Text>
                <Text style={topicTextStyle}>{this.channelTopic}</Text>
            </View>
        );
    }

    renderThrow() {
        const { chat } = this;
        if (!chat) return null;
        const { canIAdmin, canILeave } = chat;
        const invited = chatState.chatInviteStore.sent.get(chat.id);
        const body = (
            <View>
                {this.lineBlock(canIAdmin ? this.topicTextBox : this.topicTextView)}
                {canILeave && this.lineBlock(this.action(tx('button_leaveChannel'), 'remove-circle-outline', this.leaveChannel), true)}
                {canIAdmin && this.lineBlock(this.action(tx('button_deleteChannel'), 'delete', this.deleteChannel))}
                {chat.allJoinedParticipants && this.lineBlock(
                    <View style={{ paddingVertical: vars.spacing.small.midi2x }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                            <Text style={[textStyle, { marginBottom: vars.spacing.small.maxi2x }]}>
                                {tx('title_Members')}
                            </Text>
                            {canIAdmin && icons.dark('add-circle-outline', () => chatState.routerModal.channelAddPeople())}
                        </View>
                        {chat.allJoinedParticipants.map(this.participant)}
                    </View>
                )}
                {invited && this.lineBlock(
                    <View style={{ paddingVertical: vars.spacing.small.midi2x }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                            <Text style={[textStyle, { marginBottom: vars.spacing.small.maxi2x }]}>
                                {tx('title_invited')}
                            </Text>
                        </View>
                        {invited.map(this.participant)}
                    </View>
                )}
            </View>
        );
        return (<LayoutModalExit
            body={body}
            title={`# ${chat.name}`}
            onClose={() => chatState.routerModal.discard()} />);
    }
}
