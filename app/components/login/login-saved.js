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
        this.checkPin = this.checkPin.bind(this);
    }

    checkPin(pin, pinControl) {
        if (pin !== '111111') {
            pinControl.shake();
        } else {
            this.signIn();
        }
    }

    signIn() {
        loginState.login();
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
                <Pin
                    messageEnter={' '}
                    checkPin={this.checkPin}
                    onConfirm={pin => this.usePin(pin)} />
            </View>
        );
        return <Layout2 body={body} footer={<LoginSavedFooter />} />;
    }
}

