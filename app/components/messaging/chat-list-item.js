import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import Avatar from '../shared/avatar';
import chatState from './chat-state';
import icons from '../helpers/icons';

@observer
export default class ChatListItem extends Component {
    render() {
        const empty = null;
        const { chat } = this.props;
        const { mostRecentMessage } = chat;
        if (!chat.participants) return empty;
        const contact = chat.participants[0];
        if (!contact) return empty;
        const key = chat.id;
        const msg = mostRecentMessage ? mostRecentMessage.text : '';
        const timestamp = mostRecentMessage ? mostRecentMessage.timestamp : 'nope';
        const text = msg.replace(/\n[ ]+/g, '\n');
        const onPress = () => chatState.routerMain.chats(chat);
        const bold = chat.unreadCount > 0;
        return (
            <Avatar
                icon="keyboard-arrow-right"
                bold
                ellipsize
                date={timestamp}
                contact={contact}
                title={chat.chatName}
                hideOnline
                message={text}
                key={key}
                onPress={onPress}
                onPressAvatar={onPress}
            />
        );
    }
}

ChatListItem.propTypes = {
    chat: React.PropTypes.any.isRequired
};
