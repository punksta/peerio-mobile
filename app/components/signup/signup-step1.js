import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import TextBox from '../controls/textbox';
import Link from '../controls/link';
import Bold from '../controls/bold';
import LanguagePickerBox from '../controls/language-picker-box';
import SignupFooter from '../controls/signup-footer';
import Layout1 from '../layout/layout1';
import styles from '../../styles/styles';
import signupState from './signup-state';
import { t, T } from '../utils/translator';

@observer
export default class SignupStep1 extends Component {
    constructor(props) {
        super(props);
        this.url = 'https://www.peerio.com/';
    }

    render() {
        const style = styles.wizard;
        const tosParser = {
            emphasis: text => <Bold>{text}</Bold>,
            tosLink: text => <Link url={this.url}>{text}</Link>
        };
        const body = (
            <View style={style.containerFlex}>
                <Text style={style.text.title}>{t('signup')}</Text>
                <Text style={style.text.subTitle}>{t('profile')}</Text>
                <TextBox
                    lowerCase
                    state={signupState}
                    name="username"
                    hint={t('username')} />
                <TextBox
                    keyboardType="email-address"
                    state={signupState}
                    name="email"
                    hint={t('email')} />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TextBox
                            state={signupState}
                            name="firstName"
                            hint={t('firstName')} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextBox
                            onSubmit={() => signupState.next()}
                            state={signupState}
                            name="lastName"
                            hint={t('lastName')} />
                    </View>
                </View>
                <LanguagePickerBox />
                <Text style={style.text.info}>
                    <T k="signup_TOSRequestText">{tosParser}</T>
                </Text>
                <View style={{ flexGrow: 1 }} />
                <SignupFooter />
            </View>
        );

        return (
            <Layout1 body={body} />
        );
    }
}
