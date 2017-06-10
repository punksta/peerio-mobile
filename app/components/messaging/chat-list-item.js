import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import chatState from './chat-state';
import { User, contactStore, systemMessages } from '../../lib/icebear';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';

@observer
export default class ChatListItem extends SafeComponent {
    get rightIcon() {
        const { chat } = this.props;
        return (
            <View style={{ flex: 0, width: 46, height: 46, justifyContent: 'center' }}>
                {chat.unreadCount > 0 ?
                    icons.unreadBubble(chat.unreadCount) : icons.dark('keyboard-arrow-right')}
            </View>
        );
    }

    renderMostRecentMessage(c) {
        const m = c.mostRecentMessage;
        if (!m) return null;
        if (m.systemData) {
            return <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontStyle: 'italic' }}>{systemMessages.getSystemMessageText(m)}</Text>;
        }
        let username = m.sender.username;
        if (username === User.current.username) username = tx('title_you');
        return (
            <Text numberOfLines={1} ellipsizeMode="tail">
                <Text style={{ fontWeight: 'bold' }}>{username}{`: `}</Text>
                <Text style={{ color: vars.txtMedium }}>
                    {m.files && m.files.length
                        ? tx('title_filesShared', { count: m.files.length })
                        : m.text}
                </Text>
            </Text>
        );
    }

    renderThrow() {
        const { chat } = this.props;
        const { mostRecentMessage, participants } = chat;
        // group chats have empty for contact
        let contact = {};
        // no participants means chat with yourself
        if (!participants) contact = contactStore.getContact(User.current.username);
        // two participants
        if (participants && participants.length === 1) contact = participants[0];
        const key = chat.id;
        const timestamp = mostRecentMessage ? mostRecentMessage.messageTimestampText : null;
        const message = this.renderMostRecentMessage(chat);
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
                messageComponent={message}
                key={key}
                onPress={onPress}
                onPressAvatar={onPress}
            />
        );
    }
}

ChatListItem.propTypes = {
    chat: PropTypes.any.isRequired
};
