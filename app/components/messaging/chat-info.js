import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import { observable } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import RecentFilesList from '../files/recent-files-list';
import ContactCard from '../shared/contact-card';

const pinOff = require('../../assets/chat/icon-pin-off.png');
const pinOn = require('../../assets/chat/icon-pin-on.png');

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
        return (
            <ContactCard
                contact={contact}
                key={contact.username || i}
                backgroundColor={vars.darkBlueBackground05} />
        );
    };

    renderThrow() {
        const chat = chatState.currentChat;
        const body = (
            <View>
                {chat.otherParticipants && this.lineBlock(
                    <View style={{ paddingVertical: vars.spacing.small.midi2x, backgroundColor: vars.subtleBlueBackground }}>
                        {chat.otherParticipants.map(this.participant)}
                    </View>
                )}
                <RecentFilesList collapsed={false} />
            </View>
        );
        const rightIcon = icons.imageButton(
            chat.isFavorite ? pinOn : pinOff,
            () => chat.toggleFavoriteState(),
            null,
            vars.opacity54
        );
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
