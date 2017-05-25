import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import Avatar from '../shared/avatar';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

export default class ChatInfo extends SafeComponent {
    @observable chatName = '';

    componentDidMount() {
        const chat = chatState.currentChat;
        this.chatName = chat.name;
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
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
        return (
            <Avatar
                noBorderBottom
                contact={contact}
                key={username || i}
                message={''}
                hideOnline />
        );
    }

    renameTextBox() {
        const chat = chatState.currentChat;
        const update = () => chat.rename(this.chatName);
        return (
            <TextInput
                onChangeText={text => (this.chatName = text)}
                onBlur={update}
                onEndEditing={update}
                value={this.chatName}
                style={{ paddingLeft: 18, height: vars.inputHeight, color: vars.txtDark }} />
        );
    }

    renderThrow() {
        const chat = chatState.currentChat;
        const body = (
            <View>
                {this.lineBlock(this.renameTextBox())}
                {this.lineBlock(this.action('Hide chat', 'remove-circle-outline', this.hideChat))}
                {chat.participants && this.lineBlock(
                    <View style={{ paddingVertical: 8 }}>
                        {chat.participants.map(this.participant)}
                    </View>
                )}
            </View>
        );
        const rightIcon = icons.gold(chat.isFavorite ? 'star' : 'star-border',
            () => chat.toggleFavoriteState());
        return (<LayoutModalExit
            body={body}
            title={chatState.title}
            rightIcon={rightIcon}
            onClose={() => chatState.routerModal.discard()} />);
    }
}

ChatInfo.propTypes = {
    chat: React.PropTypes.any
};
