import PropTypes from 'prop-types';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class ButtonText extends SafeComponent {
    renderThrow() {
        const { text, secondary, onPress } = this.props;
        const textStyle = {
            color: secondary ? vars.txtDate : vars.bg,
            fontWeight: 'bold'
        };
        const padding = vars.spacing.small.maxi2x;
        const touchable = {
            padding
        };

        return (
            <TouchableOpacity
                testID={this.props.testID}
                pressRetentionOffset={vars.retentionOffset}
                style={touchable}
                onPress={onPress}>
                <Text style={textStyle}>
                    {text.toUpperCase ? text.toUpperCase() : text}
                </Text>
            </TouchableOpacity>
        );
    }
}

ButtonText.propTypes = {
    text: PropTypes.any,
    testID: PropTypes.any,
    onPress: PropTypes.any,
    secondary: PropTypes.bool
};
