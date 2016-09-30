import React, { Component } from 'react';
import {
    View
} from 'react-native';
import Layout2 from '../layout/layout2';
import Center from '../controls/center';
import Big from '../controls/big';
import Bold from '../controls/bold';
import LoginSavedFooter from './login-saved-footer';
import Pin from '../controls/pin';
import styles from '../../styles/styles';
import loginState from './login-state';
import forms from '../helpers/forms';

export default class LoginSaved extends Component {
    constructor(props) {
        super(props);
        forms.mixin(this, loginState);
        this.signIn = this.signIn.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    signIn() {
        loginState.pin = true;
    }

    changeUser() {
        loginState.saved = false;
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View style={style.containerFlex}>
                <Center style={{
                    marginTop: 6,
                    marginBottom: 18
                }}>
                    <Big style={styles.text.inverse}>Welcome back, <Bold>Alice</Bold></Big>
                </Center>
                <Pin onConfirm={pin => this.usePin(pin)} />
            </View>
        );
        return <Layout2 body={body} footer={<LoginSavedFooter />} />;
    }
}

