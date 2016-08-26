import React, { Component } from 'react';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Picker from 'react-native-picker';
import TextBox from '../controls/textbox';
import { styles } from '../../styles/styles';

const info = observable({
    username: '',
    name: 'Alice Vinkins',
    email: 'alicevinkins@mailinator.com',
    language: 'English'
});

@observer
export default class LoginStep1 extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChangeText.bind(this);
    }
    onChangeText(name, text) {
        // console.log(name);
        // console.log(text);
        info[name] = text;
    }
    render() {
        const style = styles.wizard;
        const props = (name, hint) => ({
            value: info[name],
            name,
            onChangeText: this.onChangeText,
            hint
        });
        return (
            <View style={style.container}>
                <Text style={style.text.title}>Signup</Text>
                <Text style={style.text.subTitle}>Profile</Text>
                <TextBox {...props('username', 'Username')} />
                <TextBox {...props('name', 'Name')} />
                <TextBox {...props('email', 'Email')} />
                <TextBox {...props('language', 'Language')} />
                <Text style={style.text.info}>
                    By creating a <Text style={{ fontWeight: 'bold' }}>Peerio</Text> account you agree to
                    our <Text style={{ textDecorationLine: 'underline' }}>terms of service</Text>
                </Text>
            </View>
        );
    }
}
