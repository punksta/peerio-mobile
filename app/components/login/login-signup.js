import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react/native';
import { t, tu } from '../utils/translator';
import Button from '../controls/button';
import ErrorText from '../controls/error-text';
import signupState from '../signup/signup-state';
import loginState from '../login/login-state';
import { vars } from '../../styles/styles';

@observer
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

    button(text, testId, action) {
        const bStyle = {
            padding: 24
        };
        const textStyle = {
            fontWeight: 'bold'
        };
        return (
            <Button
                key={text}
                testID={testId}
                style={bStyle}
                disabled={!loginState.isConnected}
                textStyle={textStyle}
                text={tu(text)}
                onPress={action} />
        );
    }

    render() {
        const activityIndicator = <ActivityIndicator color={vars.highlight} style={{ height: 14 }} />;
        let item = loginState.isInProgress ? activityIndicator : [
            this.button('signup', 'signupButton', this.signUp),
            this.button('login', 'loginButton', this.login)
        ];
        item = loginState.error ? <ErrorText>{t(loginState.error)}</ErrorText> : item;
        return (
            <View style={{ flexDirection: 'row', height: 50 }}>
                {item}
            </View>
        );
    }
}
