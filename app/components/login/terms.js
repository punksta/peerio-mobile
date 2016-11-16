import React, { Component } from 'react';
import {
    Linking
} from 'react-native';
import { t } from 'peerio-translator';
import Button from '../controls/button';
import Center from '../controls/center';
import loginState from '../login/login-state';

export default class Terms extends Component {
    constructor(props) {
        super(props);
        this.terms = this.terms.bind(this);
    }

    terms() {
        if (loginState.isInProgress) return;
        Linking.openURL('https://www.peerio.com/');
    }

    render() {
        return (
            <Center>
                <Button text={t('terms')} onPress={this.terms} />
            </Center>
        );
    }
}
