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
import TextBox from '../controls/textbox';
import SignupFooter from '../controls/signup-footer';
import Layout1 from '../layout/layout1';
import styles from '../../styles/styles';
import signupState from './signup-state';

const info = observable({
    username: '',
    name: 'Alice Vinkins',
    email: 'alicevinkins@mailinator.com',
    language: 'English'
});

export default class SignupImportContacts extends Component {
    onChangeText(name, text) {
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
        let body = (
            <View style={style.container}>
                <View>
                    <Text style={style.text.title}>Signup</Text>
                    <Text style={style.text.subTitle}>Import contacts</Text>
                </View>
            </View>
        );

        return (
            <Layout1 body={body} footer={<SignupFooter />} />
        );
    }
}

