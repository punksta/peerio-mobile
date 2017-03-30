import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import TextBox from '../controls/textbox';
import Bold from '../controls/bold';
import LanguagePickerBox from '../controls/language-picker-box';
import styles from '../../styles/styles';
import signupState from './signup-state';
import { popupTOS } from '../shared/popups';
import { t, T } from '../utils/translator';

@observer
export default class SignupStep1 extends Component {
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

    render() {
        const style = styles.wizard;
        const tosParser = {
            emphasis: text => <Bold>{text}</Bold>,
            tosLink: text => this.tosLink(text)
        };
        return (
            <View style={[{ marginTop: 32 }]}>
                <Text style={style.text.title}>{t('signupStep1')}</Text>
                <Text style={style.text.subTitle}>{t('profile')}</Text>
                <TextBox
                    returnKeyType="next"
                    lowerCase
                    state={signupState}
                    name="username"
                    hint={t('username')} />
                <TextBox
                    returnKeyType="next"
                    keyboardType="email-address"
                    state={signupState}
                    name="email"
                    hint={t('email')} />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <TextBox
                            returnKeyType="next"
                            state={signupState}
                            maxLength={24}
                            autoShrinkTextLimit={14}
                            name="firstName"
                            hint={t('firstName')} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextBox
                            returnKeyType="go"
                            onSubmit={() => signupState.next()}
                            state={signupState}
                            maxLength={24}
                            autoShrinkTextLimit={14}
                            name="lastName"
                            hint={t('lastName')} />
                    </View>
                </View>
                <LanguagePickerBox />
                <Text style={[style.text.info, { fontSize: 14 }]}>
                    <T k="signup_TOSRequestText">{tosParser}</T>
                </Text>
                <View style={{ flexGrow: 1 }} />
            </View>
        );
    }
}
