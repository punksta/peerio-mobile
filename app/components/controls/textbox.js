import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';
import { styles } from '../../styles/styles';

export default class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    focus() {
        this.setState({ focused: true });
    }

    blur() {
        this.setState({ focused: false });
    }

    render() {
        return (
            <View style={this.state.focused ? styles.shadowBox : styles.shadowBoxUnfocused}>
                <TextInput 
                    style={this.state.focused ? styles.input : styles.inputInactive} 
                    value="Alice" 
                    onFocus={this.focus.bind(this)} 
                    onBlur={this.blur.bind(this)}
                />
            </View>
        );
    }
}

