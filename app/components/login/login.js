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
import { observer } from 'mobx-react/native';
import Layout1 from '../layout/layout1';
import SignupFooter from '../controls/signup-footer';
import TextBox from '../controls/textbox';
import Button from '../controls/button';
import Center from '../controls/center';
import Big from '../controls/big';
import Small from '../controls/small';
import Conditional from '../controls/conditional';
import styles from '../../styles/styles';

const info = observable({
    username: '',
    name: 'Peerio Test',
    passphrase: '',
    language: 'English',
    savedUserInfo: true
});

@observer
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
    }

    onChangeText(name, text) {
        info[name] = text;
    }

    signIn() {
        // Actions.signInMock1();
        info.username = 'peeriotest1';
        info.savedUserInfo = !info.savedUserInfo;
    }

    renderBody() {
        const style = styles.wizard;
        const props = (name, hint) => ({
            value: info[name],
            name,
            onChangeText: this.onChangeText,
            hint
        });
        const savedStyle = {
            backgroundColor: '#CFCFCF'
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
            <View style={style.containerNoPadding}>
                <Conditional test={info.savedUserInfo}>
                    <View style={savedStyle}>
                        <Center style={indentBig}>
                            <Big>
                                Welcome back, {info.name}
                            </Big>
                        </Center>
                        <Center style={indentSmall}>
                            <Small>
                                Not {info.name}? Tap to change user
                            </Small>
                        </Center>
                    </View>
                </Conditional>
                <View style={style.container}>
                    <Conditional test={!info.savedUserInfo}>
                        <TextBox {...props('username', 'Name')} />
                    </Conditional>
                    <TextBox {...props('passphrase', 'Passphrase')} />
                    <Conditional test={!info.savedUserInfo}>
                        <TextBox {...props('language', 'Language')} />
                    </Conditional>
                    <Center>
                        <Button text="Sign In" caps bold onPress={this.signIn} />
                    </Center>
                </View>
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

