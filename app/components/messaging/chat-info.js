import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity } from 'react-native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import Avatar from '../shared/avatar';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';

@observer
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
                message=""
                hideOnline />
        );
    }

    renderThrow() {
        const chat = chatState.currentChat;
        const body = (
            <View>
                {chat.participants && this.lineBlock(
                    <View style={{ paddingVertical: vars.spacing.small.midi2x }}>
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
    chat: PropTypes.any
};
