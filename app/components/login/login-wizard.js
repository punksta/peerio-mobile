import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import { tu } from '../utils/translator';
import loginState from './login-state';
import styles, { vars } from '../../styles/styles';
import migrator from '../../lib/legacy/migrator';
import { popupYes } from '../shared/popups';
import Button from '../controls/button';
import LoginStart from './login-start';
import LoginWizardBase from './login-wizard-base';
import LoginClean from './login-clean';
import LoginPassword from './login-password';

@observer
export default class LoginWizard extends LoginWizardBase {
    constructor(props) {
        super(props);
        this.pages = ['loginStart', 'loginClean', 'loginPassword'];
    }

    loginStart() {
        return <LoginStart login={() => this.index++} />;
    }

    loginClean() {
        return <LoginClean submit={() => this.index++} />;
    }

    loginPassword() {
        return <LoginPassword submit={() => loginState.login()} />;
    }

    footer() {
        const s = styles.wizard.footer.button.base;
        return (this.index > 0) && (
            <View>
                <Button style={s} onPress={() => (this.index--)} text={tu('back')} />
            </View>
        );
    }
    componentDidMount() {
        const load = __DEV__ && process.env.PEERIO_SKIPLOGINLOAD ? Promise.resolve(true) : loginState.load();
        load.then(() => {
            if (__DEV__) {
                loginState.username = process.env.PEERIO_USERNAME || loginState.username;
                loginState.passphrase = process.env.PEERIO_PASSPHRASE || loginState.passphrase;
                process.env.PEERIO_AUTOLOGIN && loginState.login();
            }
        });
        // migrator.run().then(keys =>
        //     popupYes('Legacy master password', 'Please write it down', JSON.parse(keys).secretKey))
        //     .catch(() => {});
    }
}
