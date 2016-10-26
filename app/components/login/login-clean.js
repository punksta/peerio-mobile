import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import Layout1 from '../layout/layout1';
import LanguagePicker from '../controls/language-picker';
import LanguagePickerBox from '../controls/language-picker-box';
import TextBox from '../controls/textbox';
import Button from '../controls/button';
import Center from '../controls/center';
import Logo from '../controls/logo';
import LoginTermsSignup from './login-terms-signup';
import loginState from './login-state';
import styles from '../../styles/styles';
import forms from '../helpers/forms';

@observer
export default class LoginClean extends Component {
    constructor(props) {
        super(props);
        forms.mixin(this, loginState);
        this.signIn = this.signIn.bind(this);

        // loginState.load();
    }

    languagePicker() {
        return <LanguagePicker />;
    }

    signIn() {
        loginState.login();
    }

    render() {
        const style = styles.wizard;
        const button = loginState.isInProgress ?
            <ActivityIndicator color={styles.vars.highlight} style={{ height: 12 }} /> :
            <Button text={t('login')} caps bold onPress={this.signIn} style={{ height: 12 }} />;
        const body = (
            <View
                style={style.containerFlex}>
                <Logo />
                <View>
                    <TextBox valid={loginState.usernameValid}
                        {...this.tb('username', t('name'))} />
                    <TextBox
                        secureTextEntry
                        {...this.tb('passphrase', t('passphrase'))} />
                    <LanguagePickerBox {...this.tb('language', t('language'))} />
                </View>
                <Center>
                    {button}
                </Center>
                <LoginTermsSignup />
                <View />
            </View>
        );
        return <Layout1 body={body} footer={null} />;
    }
}
