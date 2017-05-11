import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import TextBox from '../controls/textbox';
import Bold from '../controls/bold';
import LanguagePickerBox from '../controls/language-picker-box';
import { wizard } from '../../styles/styles';
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
        const style = wizard;
        const notice = {
            borderTopWidth: 2,
            borderBottomWidth: 2
        };
        return (
            <View style={[{ marginTop: 32 }]}>
                <Text style={style.text.title}>{t('title_signupStep2')}</Text>
                <Text testID="signupStep1Title" style={style.text.subTitle}>{t('title_accountKey')}</Text>
                <View style={notice}>
                    <Text>Don't get locked out!</Text>
                </View>
                <View style={[{ flexGrow: 1 }]} />
            </View>
        );
    }
}
