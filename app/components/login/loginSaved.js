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
export default class LoginSaved extends Component {
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
        const savedStyle = {
            backgroundColor: styles.vars.subtleBg,
            marginBottom: 16
        };
        const indentBig = {
            marginTop: 20,
            marginBottom: 10
        };
        const indentSmall = {
            marginTop: 0,
            marginBottom: 16
        };
        return (
            <View>
                <View style={savedStyle}>
                    <Center style={indentBig}>
                        <Big style={{ color: styles.vars.subtleText }}>
                            Welcome back, <Bold style={{ color: styles.vars.subtleTextBold }}>{info.name}</Bold>
                        </Big>
                    </Center>
                    <Center style={indentSmall}>
                        <Small style={{ color: styles.vars.subtleText }}>
                            Not {info.name}? Tap to change user
                        </Small>
                    </Center>
                </View>
                <View style={style.container}>
                    <TextBox {...props('passphrase', 'Passphrase')} />
                    <Center style={{ marginTop: 36 }}>
                        <Button text="Sign In" caps bold onPress={this.signIn} />
                    </Center>
                </View>
                <LoginTermsSignup />
            </View>
        );
    }
}

