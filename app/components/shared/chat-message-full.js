import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Dimensions } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import CorruptedMessage from './corrupted-message';
import ChatMessageData from './chat-message-data';
import ViewReceipts from './view-receipts';
import TouchableContactAvatar from './touchable-contact-avatar';
import ChatMessageBody from './chat-message-body';
import MessageSentError from './message-sent-error';

const { width } = Dimensions.get('window');

const itemStyle = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8
};

const itemContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: vars.spacing.medium.mini2x,
    paddingRight: vars.spacing.medium.mini2x
};

const nameMessageContainerStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: vars.spacing.medium.mini2x,
    marginRight: vars.spacing.small.midi
};

const msgStyle = {
    flexGrow: 1,
    maxWidth: width,
    flexShrink: 1,
    borderWidth: 0
};

@observer
export default class ChatMessageFull extends SafeComponent {
    renderThrow() {
        const { errorStyle, backgroundColor, messageObject, chat, onFileAction, onLegacyFileAction, onInlineImageAction } = this.props;

        return (
            <View style={[itemStyle, errorStyle, backgroundColor]}>
                <View style={msgStyle}>
                    <View
                        style={itemContainerStyle}>
                        <TouchableContactAvatar contact={messageObject.sender} />
                        <View style={[nameMessageContainerStyle]}>
                            <ChatMessageData message={messageObject} />
                            <ChatMessageBody
                                messageObject={messageObject}
                                chat={chat}
                                onFileAction={onFileAction}
                                onLegacyFileAction={onLegacyFileAction}
                                onInlineImageAction={onInlineImageAction} />
                        </View>
                    </View>
                    <MessageSentError message={messageObject} chat={chat} />
                    <CorruptedMessage visible={messageObject.signatureError} />
                    <ViewReceipts receipts={messageObject.receipts} />
                </View>
            </View>
        );
    }
}

ChatMessageFull.propTypes = {
    messageObject: PropTypes.any,
    chat: PropTypes.any,
    onFileAction: PropTypes.any,
    onLegacyFileAction: PropTypes.any,
    onInlineImageAction: PropTypes.any,
    backgroundColor: PropTypes.any,
    errorStyle: PropTypes.any
};
