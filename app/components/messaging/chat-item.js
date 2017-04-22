import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Avatar from '../shared/avatar';
import contactState from '../contacts/contact-state';

@observer
export default class ChatItem extends Component {
    render() {
        const i = this.props.message;
        if (!i.sender) return null;
        const key = i.id;
        const msg = i.text || '';
        const timestamp = i.timestamp;
        const text = msg.replace(/\n[ ]+/g, '\n');
        const onPress = () => contactState.contactView(i.sender);
        const error = !!i.signatureError;
        return (
            <Avatar
                sendError={i.sendError}
                sending={i.sending}
                contact={i.sender}
                files={i.files}
                receipts={i.receipts}
                hideOnline
                date={timestamp}
                message={text}
                key={key}
                error={error}
                onPress={onPress}
                onLayout={this.props.onLayout}
                onRetry={() => i.send()}
                onCancel={() => this.props.chat.removeMessage(i)}
                noTap
                noBorderBottom
                collapsed={!!i.groupWithPrevious}
            />
        );
    }
}

ChatItem.propTypes = {
    onLayout: React.PropTypes.func,
    onPress: React.PropTypes.func,
    chat: React.PropTypes.any.isRequired,
    message: React.PropTypes.any.isRequired
};
