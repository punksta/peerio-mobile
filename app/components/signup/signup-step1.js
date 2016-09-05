import React, { Component } from 'react';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Linking,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Picker from 'react-native-picker';
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

@observer
export default class SignupStep1 extends Component {
    constructor(props) {
        super(props);
        this.terms = this.terms.bind(this);
    }
    onChangeText(name, text) {
        info[name] = text;
    }
    terms() {
        Linking.openURL('https://www.peerio.com/');
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
                <Text style={style.text.title}>Signup</Text>
                <Text style={style.text.subTitle}>Profile</Text>
                <TextBox {...props('username', 'Username')} />
                <TextBox {...props('name', 'Name')} />
                <TextBox {...props('email', 'Email')} />
                <TextBox {...props('language', 'Language')} />
                <Text style={style.text.info}>
                    By creating a <Text style={{ fontWeight: 'bold' }}>Peerio</Text> account you agree to
                    our <Text style={{ textDecorationLine: 'underline' }} onPress={this.terms}>terms of service</Text>
                </Text>
            </View>
        );

        return (
            <Layout1 body={body} footer={<SignupFooter />} />
        );
    }
}
