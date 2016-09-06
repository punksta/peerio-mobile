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
import TextBox from '../controls/textbox';
import Button from '../controls/button';
import Center from '../controls/center';
import Big from '../controls/big';
import Small from '../controls/small';
import Bold from '../controls/bold';
import Logo from '../controls/logo';
import Conditional from '../controls/conditional';
import ReducerCreate from '../utils/reducer';
import state from '../layout/state';

const loginState = observable({
    saved: false
});

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
    render() {
        const style = styles.wizard;
        let body = (
            <View style={{ flex: 1 }}>
                <Logo />
                <Conditional test={loginState.saved}>
                    <LoginSaved />
                </Conditional>
                <Conditional test={!loginState.saved}>
                    <LoginClean />
                </Conditional>
            </View>
        );
        return (
            <Layout1 body={body} footer={null} />
        );
    }
}

