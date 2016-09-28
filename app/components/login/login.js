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
    Modal,
    Image
} from 'react-native';
import { observable, extendObservable } from 'mobx';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';
import Layout1 from '../layout/layout1';
import SignupFooter from '../controls/signup-footer';
import LoginClean from './loginClean';
import LoginSaved from './loginSaved';
import Logo from '../controls/logo';
import Conditional from '../controls/conditional';
import loginState from './login-state';
import state from '../layout/state';

@observer
export default class Login extends Component {
    static get states() {
        return {
            clean: () => { loginState.saved = false; },
            saved: () => { loginState.saved = true; }
        };
    }
    componentDidMount() {
        console.log('login mounted');
    }
    componentWillUnmount() {
        console.log('login unmount');
    }
    pageState() {
        return loginState;
    }
    button(k) {
        return (
            <TouchableOpacity
                onPress={() => { loginState.pin = false; }}
                key={k}>
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderColor: '#fff',
                        borderWidth: 1
                    }} />
            </TouchableOpacity>
        );
    }

    row(i, keys) {
        const buttons = keys.map(k => this.button(k));
        return (
            <View
                key={i}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 200
                }}>
                {buttons}
            </View>
        );
    }

    render() {
        const style = styles.wizard;
        let body = (
            <View style={{ flex: 1, borderColor: 'blue', borderWidth: 0 }}>
                <Logo />
                <Conditional test={loginState.saved}>
                    <LoginSaved />
                </Conditional>
                <Conditional test={!loginState.saved}>
                    <LoginClean />
                </Conditional>
            </View>
        );
        const rows = [this.row(0, [1, 2, 3]), this.row(1, [4, 5, 6]), this.row(2, [7, 8, 9])];
        const pinPad = (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: 300
                }}>
                    {rows}
                </View>
            </View>
        );
        body = <Layout1 body={body} footer={null} />;
        body = loginState.pin ? pinPad : body;
        return body;
    }
}

