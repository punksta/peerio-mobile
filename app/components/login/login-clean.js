import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import Layout1 from '../layout/layout1';
import LanguagePicker from '../controls/language-picker';
import LanguagePickerBox from '../controls/language-picker-box';
import TextBox from '../controls/textbox';
import Center from '../controls/center';
import Logo from '../controls/logo';
import LoginSignup from './login-signup';
import Terms from './terms';
import loginState from './login-state';
import styles from '../../styles/styles';

@observer
export default class LoginClean extends Component {
    constructor(props) {
        super(props);
        this.dummy = 'dummy';

        // if (!__DEV__) {
        // loginState.load();
        // }
    }

    componentDidMount() {
        loginState.load();
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
        const loginButton = <LoginSignup />;
        const body = (
            <View
                style={style.containerFlex}>
                <Logo />
                <View style={{ flexGrow: 0.5, flexShrink: 2 }}>
                    <TextBox lowerCase state={loginState} name="username" hint={t('username')} />
                    <TextBox state={loginState} name="passphrase" hint={t('passphrase')} secureTextEntry />
                    <LanguagePickerBox />
                </View>
                <Center>
                    {loginButton}
                </Center>
                <Terms />
                <View style={{ flexGrow: 1 }} />
            </View>
        );
        return <Layout1 body={body} footer={null} />;
    }
}
