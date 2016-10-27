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
        if (this.props.textStyle) {
            textStyle = styles.inherit(textStyle, this.props.textStyle);
        }
        const text = this.props.text || '';
        return (
            <TouchableOpacity style={this.props.style} onPress={this.props.onPress}>
                <Text style={textStyle}>
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
    bold: React.PropTypes.bool
};
