import React from 'react';
import { Text } from 'react-native';
import SafeComponent from '../shared/safe-component';

export default class CorruptedMessage extends SafeComponent {
    renderThrow() {
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
