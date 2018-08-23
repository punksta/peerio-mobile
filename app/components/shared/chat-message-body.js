import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import ChatMessageFolders from './chat-message-folders';
import ChatMessageFiles from './chat-message-files';
import ChatMessageInlineImages from './chat-message-inline-images';
import SystemMessage from './system-message';
import ChatMessageText from './chat-message-text';
import ChatMessageSendError from './chat-message-error';

@observer
export default class ChatMessageBody extends SafeComponent {
    renderThrow() {
        const { messageObject, chat, onFileAction, onLegacyFileAction, onInlineImageAction } = this.props;

        return (
            <View>
                <ChatMessageFolders
                    folders={messageObject.folders}
                    chat={chat} />
                <ChatMessageFiles
                    message={messageObject}
                    chat={chat}
                    onFileAction={onFileAction}
                    onLegacyFileAction={onLegacyFileAction} />
                <ChatMessageInlineImages
                    message={messageObject}
                    chat={chat}
                    onInlineImageAction={onInlineImageAction}
                    onLegacyFileAction={onLegacyFileAction} />
                <ChatMessageText message={messageObject.text} />
                <SystemMessage message={messageObject} />
                <ChatMessageSendError visible={messageObject.sendError} />
            </View>
        );
    }
}

ChatMessageBody.propTypes = {
    messageObject: PropTypes.any,
    chat: PropTypes.any,
    onFileAction: PropTypes.any,
    onLegacyFileAction: PropTypes.any,
    onInlineImageAction: PropTypes.any
};
