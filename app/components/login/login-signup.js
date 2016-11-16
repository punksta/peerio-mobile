import React, { Component } from 'react';
import { tu } from 'peerio-translator';
import Button from '../controls/button';
import Center from '../controls/center';
import signupState from '../signup/signup-state';
import loginState from '../login/login-state';

export default class LoginSignup extends Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
    }

    signUp() {
        if (loginState.isInProgress) return;
        signupState.transition();
    }

    login() {
        loginState.login();
    }

    render() {
        const bStyle = {
            marginLeft: 24,
            marginRight: 24
        };
        const textStyle = {
            fontWeight: 'bold'
        };
        return (
            <Center>
                <Button style={bStyle} textStyle={textStyle} text={tu('signup')} onPress={this.signUp} />
                <Button style={bStyle} textStyle={textStyle} text={tu('login')} onPress={this.login} />
            </Center>
        );
    }
}
