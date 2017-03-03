import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import Layout1 from '../layout/layout1';
import LanguagePicker from '../controls/language-picker';
import TextBox from '../controls/textbox';
import Center from '../controls/center';
import Logo from '../controls/logo';
import LoginSignup from './login-signup';
import loginState from './login-state';
import styles from '../../styles/styles';
import migrator from '../../lib/legacy/migrator';
import { popupYes } from '../shared/popups';

@observer
export default class LoginClean extends Component {
    componentDidMount() {
        const load = __DEV__ && process.env.PEERIO_SKIPLOGINLOAD ? Promise.resolve(true) : loginState.load();
        load.then(() => {
            if (__DEV__) {
                loginState.username = process.env.PEERIO_USERNAME || loginState.username;
                loginState.passphrase = process.env.PEERIO_PASSPHRASE || loginState.passphrase;
                process.env.PEERIO_AUTOLOGIN && loginState.login();
            }
        });
        migrator.run().then(keys =>
            popupYes('Legacy master password', 'Please write it down', JSON.parse(keys).secretKey))
            .catch(() => {});
    }

    languagePicker() {
        return <LanguagePicker />;
    }

    render() {
        const style = styles.wizard;
        const loginButton = <LoginSignup />;
        const body = (
            <View
                style={style.containerFlex}>
                <Logo />
                <Text style={{ color: 'rgba(255, 255, 255, 1)', fontSize: 24, marginBottom: 16 }}>{t('login')}</Text>
                <View style={{ flexGrow: 1, flexShrink: 2, justifyContent: 'flex-start', maxHeight: 192 }}>
                    <TextBox lowerCase state={loginState} name="username" hint={t('username')} />
                    <TextBox state={loginState} name="passphrase" hint={t('passphrase')} secureTextEntry />
                </View>
                <Center>
                    {loginButton}
                </Center>
                <View style={{ flexGrow: 1 }} />
            </View>
        );
        return <Layout1 body={body} footer={null} />;
    }
}
