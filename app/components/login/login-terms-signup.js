import React, { Component } from 'react';
import {
    View,
    Text,
    Linking
} from 'react-native';

import Button from '../controls/button';
import Center from '../controls/center';
import styles from '../../styles/styles';
import signupState from '../signup/signup-state';

export default class LoginTermsSignup extends Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
        this.terms = this.terms.bind(this);
    }

    signUp() {
        signupState.transition();
    }

    terms() {
        Linking.openURL('https://www.peerio.com/');
    }

    render() {
        return (
            <Center>
                <Button text="Terms" onPress={this.terms} />
                <Text style={{ color: styles.vars.highlight }}> | </Text>
                <Button text="Sign up" onPress={this.signUp} />
            </Center>
        );
    }
}

Center.propTypes = {
};

