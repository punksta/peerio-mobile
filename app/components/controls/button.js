import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import styles from '../../styles/styles';

export default class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = styles.button;
        const textStyle = this.props.bold ? 
            style.text.bold : style.text.normal;
        var text = this.props.text || "";
        text = this.props.caps ? text.toUpperCase() : text;
        return (
            <TouchableOpacity style={this.props.style}>
                <Text style={textStyle} onPress={this.props.onPress}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }
}

Button.propTypes = {
    onPress: React.PropTypes.func.isRequired,
    style: React.PropTypes.any,
    text: React.PropTypes.string.isRequired,
    caps: React.PropTypes.bool,
    bold: React.PropTypes.bool
};
