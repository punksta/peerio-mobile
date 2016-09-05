import React, { Component } from 'react';
import { Scene, Router, TabBar, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    View
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import TextBox from '../controls/textbox';
import Button from '../controls/button';
import Center from '../controls/center';
import Big from '../controls/big';
import Small from '../controls/small';
import Bold from '../controls/bold';
import Logo from '../controls/logo';
import Conditional from '../controls/conditional';
import LoginTermsSignup from './login-terms-signup';
import styles from '../../styles/styles';

const info = observable({
    username: '',
    name: 'Peerio Test',
    passphrase: '',
    language: 'English',
    savedUserInfo: true
});

@observer
export default class LoginClean extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText(name, text) {
        info[name] = text;
    }

    signIn() {
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
                <View>
                    <TextBox {...props('username', 'Name')} />
                    <TextBox {...props('passphrase', 'Passphrase')} />
                    <TextBox {...props('language', 'Language')} />
                </View>
                <Center>
                    <Button text="Sign In" caps bold onPress={this.signIn} />
                </Center>
                <LoginTermsSignup />
            </View>
        );
    }
}
