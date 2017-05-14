import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import Avatar from '../shared/avatar';
import chatState from './chat-state';
import { User, contactStore } from '../../lib/icebear';
import icons from '../helpers/icons';

@observer
export default class ChatListItem extends Component {
    get rightIcon() {
        const { chat } = this.props;
        return chat.unreadCount > 0 ?
            icons.unreadBubble(chat.unreadCount) : icons.dark('keyboard-arrow-right');
    }

    render() {
        const { chat } = this.props;
        const { mostRecentMessage, participants } = chat;
        // group chats have null for contact
        let contact = null;
        // no participants means chat with yourself
        if (!participants) contact = contactStore.getContact(User.current.username);
        // two participants
        if (participants.length === 1) contact = participants[0];
        const key = chat.id;
        const msg = mostRecentMessage ? mostRecentMessage.text : '';
        const timestamp = mostRecentMessage ? mostRecentMessage.messageTimestampText : null;
        const text = msg ? msg.replace(/\n[ ]+/g, '\n') : '';
        const onPress = () => chatState.routerMain.chats(chat);
        const unread = chat.unreadCount > 0;
        return (
            <Avatar
                disableMessageTapping
                starred={chat.isFavorite}
                rightIcon={this.rightIcon}
                extraPaddingTop={8}
                extraPaddingVertical={8}
                unread={unread}
                ellipsize
                timestampText={timestamp}
                contact={contact}
                title={chat.name}
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
