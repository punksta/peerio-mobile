import React, { Component } from 'react';
import { Scene, Router, TabBar, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    Modal
} from 'react-native';
import { observable } from 'mobx';
import Layout1 from '../layout/layout1';
import SignupFooter from '../controls/signup-footer';
import TextBox from '../controls/textbox';
import styles from '../../styles/styles';

const info = observable({
    username: '',
    name: '',
    email: 'alicevinkins@mailinator.com',
    language: 'English'
});

export default class Login extends Component {
    onChangeText(name, text) {
        info[name] = text;
    }
    renderBody() {
        const style = styles.wizard;
        const props = (name, hint) => ({
            value: info[name],
            name,
            onChangeText: this.onChangeText,
            hint
        });
        return (
            <View style={style.container}>
                <TextBox {...props('name', 'Name')} />
                <TextBox {...props('email', 'Email')} />
                <TextBox {...props('language', 'Language')} />
            </View>
        );
    }
    renderFooter() {
        return null;
    }
    render() {
        return (
            <Layout1 body={this.renderBody()} footer={this.renderFooter()} />
        );
    }
}

