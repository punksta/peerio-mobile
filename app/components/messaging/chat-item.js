import React, { Component } from 'react';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import contactState from '../contacts/contact-state';
import { systemMessages } from '../../lib/icebear';
import { t } from '../utils/translator';

export default class ChatItem extends SafeComponent {
    renderThrow() {
        const i = this.props.message;
        if (!i.sender) return null;
        const key = i.id;
        const msg = i.text || '';
        const text = msg.replace(/\n[ ]+/g, '\n');
        const onPressAvatar = () => contactState.contactView(i.sender);
        const onPress = i.sendError ? this.props.onRetryCancel : null;
        const error = !!i.signatureError;
        const systemMessageText =
            i.systemData && systemMessages.getSystemMessageText(i) || null;
        return (
            <Avatar
                sendError={i.sendError}
                sending={i.sending}
                contact={i.sender}
                files={i.files}
                receipts={i.receipts}
                hideOnline
                timestampText={i.messageTimestampText}
                message={text}
                systemMessage={systemMessageText}
                key={key}
                error={error}
                onPress={onPress}
                onPressAvatar={onPressAvatar}
                onLayout={this.props.onLayout}
                onRetryCancel={this.props.onRetryCancel}
                noBorderBottom
                collapsed={!!i.groupWithPrevious}
                extraPaddingTop={8}
            />
        );
    }
}

ChatItem.propTypes = {
    onLayout: React.PropTypes.func,
    onPress: React.PropTypes.func,
    onRetryCancel: React.PropTypes.func,
    message: React.PropTypes.any.isRequired
};
