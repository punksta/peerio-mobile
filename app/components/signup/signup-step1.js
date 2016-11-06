import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import TextBox from '../controls/textbox';
import Link from '../controls/link';
import LanguagePickerBox from '../controls/language-picker-box';
import SignupFooter from '../controls/signup-footer';
import Layout1 from '../layout/layout1';
import styles from '../../styles/styles';
import signupState from './signup-state';
import forms from '../helpers/forms';
import { t, T } from '../utils/translator';

@observer
export default class SignupStep1 extends Component {
    constructor(props) {
        super(props);
        forms.mixin(this, signupState);
        this.url = 'https://www.peerio.com/';
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View style={style.containerFlex}>
                <Text style={style.text.title}>{t('signup')}</Text>
                <Text style={style.text.subTitle}>{t('profile')}</Text>
                <TextBox
                    valid={signupState.usernameValid}
                    validationMessage={signupState.usernameValidationMessage}
                    {...this.tb('username', t('username'))} />
                <TextBox
                    valid={signupState.emailValid}
                    validationMessage={signupState.emailValidationMessage}
                    {...this.tb('email', t('email'))} />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TextBox
                            info={t('optional')}
                            {...this.tb('firstName', t('firstName'))} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextBox
                            info={t('optional')}
                            {...this.tb('lastName', t('lastName'))} />
                    </View>
                </View>
                <LanguagePickerBox {...this.tb('language', t('language'))} />
                <Text style={style.text.info}>
                    <T k="signup_TOSRequestText">
                        {{ tosLink: text => <Link url={this.url}>{text}</Link> }}
                    </T>
                </Text>
                <View style={{ flex: 1 }} />
            </View>
        );

        return (
            <Layout1 body={body} footer={<SignupFooter />} />
        );
    }
}
