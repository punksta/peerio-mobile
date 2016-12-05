import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';
import styles from '../../styles/styles';

export default class Button extends Component {
    render() {
        const style = styles.button;
        let textStyle = this.props.bold ?
            style.text.bold : style.text.normal;
        const opacity = { opacity: this.props.disabled ? 0.5 : 1 };
        if (this.props.textStyle) {
            textStyle = [textStyle, this.props.textStyle];
        }
        const text = this.props.text || '';
        return (
            <TouchableOpacity testID={this.props.testID} style={this.props.style} onPress={this.props.disabled ? null : this.props.onPress}>
                <Text style={[textStyle, opacity]}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }
}

Button.propTypes = {
    onPress: React.PropTypes.func.isRequired,
    style: React.PropTypes.any,
    textStyle: React.PropTypes.any,
    text: React.PropTypes.any.isRequired,
    caps: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    testID: React.PropTypes.string,
    bold: React.PropTypes.bool
};
