import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ChatActionSheet from '../messaging/chat-action-sheet';
import ErrorCircle from './error-circle';


@observer
export default class MessageSentError extends SafeComponent {
    @action.bound onPress() {
        ChatActionSheet.show(this.props.message, this.props.chat);
    }

    renderThrow() {
        const { message } = this.props;
        const { sendError, signatureError } = message;
        if (!sendError && !signatureError) return null;

        return (
            <ErrorCircle
                onPress={this.onPress}
                invert={!message.sendError}
                visible={!!message.signatureError || message.sendError} />
        );
    }
}

MessageSentError.propTypes = {
    message: PropTypes.any,
    chat: PropTypes.any
};
