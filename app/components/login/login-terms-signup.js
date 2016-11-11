import React, { Component } from 'react';
import {
    Text,
    Linking
} from 'react-native';
import { t } from 'peerio-translator';
import Button from '../controls/button';
import Center from '../controls/center';
import styles from '../../styles/styles';
import signupState from '../signup/signup-state';
import loginState from '../login/login-state';

export default class LoginTermsSignup extends Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
        this.terms = this.terms.bind(this);
    }

    signUp() {
        if (loginState.isInProgress) return;
        signupState.transition();
    }

    terms() {
        if (loginState.isInProgress) return;
        Linking.openURL('https://www.peerio.com/');
    }

    render() {
        return (
            <Center>
                <Button text={t('terms')} onPress={this.terms} />
                <Text style={{ color: styles.vars.highlight }}> | </Text>
                <Button text={t('signup')} onPress={this.signUp} />
            </Center>
        );
    }
}

Center.propTypes = {
};

