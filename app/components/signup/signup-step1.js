import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import SafeComponent from '../shared/safe-component';
import TextBox from '../controls/textbox';
import Bold from '../controls/bold';
import LanguagePickerBox from '../controls/language-picker-box';
import { vars, wizard } from '../../styles/styles';
import signupState from './signup-state';
import { popupTOS } from '../shared/popups';
import { t, T } from '../utils/translator';

export default class SignupStep1 extends SafeComponent {
    constructor(props) {
        super(props);
        this.url = 'https://www.peerio.com/';
    }

    tosLink(text) {
        return (
            <Text
                onPress={popupTOS}
                style={{ textDecorationLine: 'underline' }}>
                {text}
            </Text>
        );
    }

    renderThrow() {
        const style = wizard;
        const tosParser = {
            emphasis: text => <Bold>{text}</Bold>,
            tosLink: text => this.tosLink(text)
        };
        return (
            <View style={[{ marginTop: 32, paddingHorizontal: vars.wizardPadding }]}>
                <Text style={style.text.title}>{t('title_signupStep1')}</Text>
                <Text testID="signupStep1Title" style={style.text.subTitle}>{t('title_settingsProfile')}</Text>
                <TextBox
                    returnKeyType="next"
                    lowerCase
                    state={signupState}
                    keyboardType="email-address"
                    name="username"
                    hint={t('title_username')} />
                <TextBox
                    returnKeyType="next"
                    keyboardType="email-address"
                    lowerCase
                    state={signupState}
                    name="email"
                    hint={t('title_email')} />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TextBox
                            returnKeyType="next"
                            state={signupState}
                            maxLength={24}
                            autoShrinkTextLimit={14}
                            name="firstName"
                            hint={t('title_firstName')} />
                    </View>
                    <View style={{ flex: 0, width: 4 }} />
                    <View style={{ flex: 1 }}>
                        <TextBox
                            returnKeyType="go"
                            onSubmit={() => signupState.next()}
                            state={signupState}
                            maxLength={24}
                            autoShrinkTextLimit={14}
                            name="lastName"
                            hint={t('title_lastName')} />
                    </View>
                </View>
                {/* <LanguagePickerBox /> */}
                <Text style={[style.text.info, { fontSize: 14 }]}>
                    <T k="title_TOSRequestText">{tosParser}</T>
                </Text>
                <View style={[{ flexGrow: 1 }]} />
            </View>
        );
    }
}
