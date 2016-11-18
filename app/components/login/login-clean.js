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
import Center from '../controls/center';
import ErrorText from '../controls/error-text';
import Logo from '../controls/logo';
import LoginSignup from './login-signup';
import Terms from './terms';
import loginState from './login-state';
import styles from '../../styles/styles';
import forms from '../helpers/forms';

@observer
export default class LoginClean extends Component {
    constructor(props) {
        super(props);

        if (!__DEV__) {
            loginState.load();
        }
    }

    componentDidMount() {
        if (__DEV__) {
            loginState.username = 'anritest7';
            loginState.passphrase = 'icebear';
            // loginState.login();
        }
    }

    languagePicker() {
        return <LanguagePicker />;
    }

    render() {
        const style = styles.wizard;
        const activityIndicator = <ActivityIndicator color={styles.vars.highlight} style={{ height: 14 }} />;
        const loginButton = <LoginSignup />;
        const button = loginState.isInProgress ? activityIndicator : loginButton;
        const centerItem = loginState.error ? <ErrorText>{t(loginState.error)}</ErrorText> : button;
        const body = (
            <View
                style={style.containerFlex}>
                <Logo />
                <View>
                    <TextBox lowerCase state={loginState} name="username" hint={t('username')} />
                    <TextBox state={loginState} name="passphrase" hint={t('passphrase')} secureTextEntry />
                    <LanguagePickerBox />
                </View>
                <View style={{ height: 40, marginBottom: 42 }}>
                    <Center>
                        {centerItem}
                    </Center>
                </View>
                <Terms />
                <View />
            </View>
        );
        return <Layout1 body={body} footer={null} />;
    }
}
