import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import { observer } from 'mobx-react/native';

@observer
export default class CorruptedMessage extends Component {
    render() {
        if (!this.props.visible) return null;
        return (
            <Text style={{ margin: 8 }}>
                The cryptographic signature of this
                message is invalid. This might mean
                someone forged this message.
            </Text>
        );
    }
}

CorruptedMessage.propTypes = {
    visible: React.PropTypes.bool
};
