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
        var style = this.state.focused ? styles.input.active : styles.input.normal;
        return (
            <View style={style.shadow}>
                <TextInput 
                    style={style.textbox} 
                    value="Alice" 
                    onFocus={this.focus.bind(this)} 
                    onBlur={this.blur.bind(this)}
                />
            </View>
        );
    }
}

