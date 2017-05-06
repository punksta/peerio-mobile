import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Avatar from '../shared/avatar';
import contactState from '../contacts/contact-state';
import { t } from '../utils/translator';

@observer
export default class ChatItem extends Component {
    getSystemMessageText(msg) {
        if (!msg.systemData) return null;
        switch (msg.systemData.action) {
            case 'rename':
                return msg.systemData.newName
                    ? t('title_chatRenamed', { name: msg.systemData.newName })
                    : t('title_chatNameRemoved');
            case 'create':
                return t('title_chatCreated', { fullName: msg.sender.fullName });
            default:
                return '';
        }
    }

    render() {
        const i = this.props.message;
        if (!i.sender) return null;
        const key = i.id;
        const msg = i.text || '';
        const text = msg.replace(/\n[ ]+/g, '\n');
        const onPressAvatar = () => contactState.contactView(i.sender);
        const onPress = i.sendError ? this.props.onRetryCancel : null;
        const error = !!i.signatureError;
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
                systemMessage={this.getSystemMessageText(i)}
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
