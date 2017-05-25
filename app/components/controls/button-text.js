import React from 'react';
import {
    Text, TouchableOpacity
} from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

export default class ButtonText extends SafeComponent {
    renderThrow() {
        const { text, secondary, onPress } = this.props;
        const textStyle = {
            color: secondary ? vars.txtDate : vars.bg,
            fontWeight: 'bold'
        };
        const padding = 12;
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
    text: React.PropTypes.any,
    testID: React.PropTypes.any,
    onPress: React.PropTypes.any,
    secondary: React.PropTypes.bool
};
