import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { observable } from 'mobx';
import Menu, { MenuOptions, MenuOption, MenuTrigger, MenuContext } from 'react-native-menu';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import Avatar from '../shared/avatar';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

const textStyle = {
    color: vars.txtDate,
    marginTop: 10,
    fontSize: 12,
    marginLeft: 18,
    fontWeight: 'bold'
};

@observer
export default class ChannelInfo extends SafeComponent {
    @observable channelTopic = '';

    componentDidMount() {
        const chat = chatState.currentChat;
        this.channelTopic = chat.topic;
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

    hideChat = () => {
        chatState.currentChat.hide();
        chatState.routerModal.discard();
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
        const { username } = contact;
        const row = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1
        };
        return (
            <View style={row}>
                <View style={{ flex: 1, flexGrow: 1, paddingLeft: 4 }}>
                    <Avatar
                        noBorderBottom
                        contact={contact}
                        key={username || i}
                        message={''}
                        hideOnline />
                </View>
                <Menu onSelect={action => action()}>
                    <MenuTrigger
                        renderTouchable={() => <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} />}
                        style={{ padding: vars.iconPadding }}>
                        {icons.plaindark('more-vert')}
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption
                            value={() => chatState.currentChat.removeChannelMember(contact)}>
                            <Text>Remove</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        );
    }

    topicTextBox() {
        const chat = chatState.currentChat;
        const update = () => console.log(this.channelTopic);
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
            <MenuContext>
                <View>
                    {this.lineBlock(this.topicTextBox())}
                    {this.lineBlock(this.action('Leave channel', 'remove-circle-outline', this.leaveChannel), true)}
                    {this.lineBlock(this.action('Mute channel',
                        chat.isMuted ? 'notifications-off' : 'notifications-none',
                        () => chat.toggleMuted()))}
                    {this.lineBlock(this.action('Delete channel', 'delete', this.deleteChannel))}
                    {chat.participants && this.lineBlock(
                        <View style={{ paddingVertical: 8 }}>
                            <Text style={[textStyle, { marginBottom: 12 }]}>Members</Text>
                            {chat.participants.map(this.participant)}
                        </View>
                    )}
                </View>
            </MenuContext>
        );
        const rightIcon = chat.isFavorite ?
            icons.gold('star', () => chat.toggleFavoriteState()) :
            icons.dark('star-border', () => chat.toggleFavoriteState());
        return (<LayoutModalExit
            body={body}
            title={`# ${chat.title}`}
            rightIcon={rightIcon}
            onClose={() => chatState.routerModal.discard()} />);
    }
}
