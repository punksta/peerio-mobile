import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text } from 'react-native';
import SafeComponent from '../shared/safe-component';

@observer
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
    visible: PropTypes.bool
};
