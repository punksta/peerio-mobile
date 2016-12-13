import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Avatar from '../shared/avatar';

@observer
export default class ChatItem extends Component {
    render() {
        const i = this.props.chat;
        const key = i.id;
        const msg = i.text || '';
        const timestamp = i.timestamp;
        const name = i.sender.username;
        const color = i.sender.color;
        const text = msg.replace(/\n[ ]+/g, '\n');
        return (
            <Avatar
                color={color}
                hideOnline
                date={timestamp}
                name={name}
                message={text}
                key={key}
                noBorderBottom
            />
        );
    }
}

ChatItem.propTypes = {
    onPress: React.PropTypes.func,
    chat: React.PropTypes.any.isRequired
};
