import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { vars, button } from '../../styles/styles';

export default class Button extends Component {
    render() {
        const style = button;
        let textStyle = this.props.bold ?
            style.text.bold : style.text.normal;
        const opacity = { opacity: this.props.disabled ? 0.5 : 1 };
        if (this.props.textStyle) {
            textStyle = [textStyle, this.props.textStyle];
        }
        const text = this.props.text || '';
        const press = () => {
            !this.props.disabled && this.props.onPress && this.props.onPress();
            return true;
        };
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                pressRetentionOffset={offset}
                onPress={press}
                accessible={this.props.accessible}
                accessibilityLabel={this.props.accessibilityLabel}
                testID={this.props.testID}>
                <View
                    style={[this.props.style]}>
                    <Text style={[{ backgroundColor: 'transparent' }, textStyle, opacity]}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

Button.propTypes = {
    style: PropTypes.any,
    textStyle: PropTypes.any,
    onPress: PropTypes.any,
    text: PropTypes.any.isRequired,
    caps: PropTypes.bool,
    disabled: PropTypes.bool,
    testID: PropTypes.string,
    bold: PropTypes.bool
};
