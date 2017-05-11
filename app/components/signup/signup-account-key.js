import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react/native';
import { wizard, vars } from '../../styles/styles';
import signupState from './signup-state';
import { popupTOS } from '../shared/popups';
import { t } from '../utils/translator';

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
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: vars.white,
            backgroundColor: '#505050A0',
            paddingVertical: 14,
            height: 100,
            justifyContent: 'center',
            paddingHorizontal: vars.wizardPadding
        };
        const normalText = {
            color: vars.white,
            marginBottom: 6
        };
        const noticeText = {
            color: vars.white,
            fontSize: 24
        };
        const noticeText2 = {
            color: vars.white,
            fontWeight: 'bold',
            fontSize: 32
        };
        const passphraseText = [noticeText2, {
            fontSize: 24
        }];
        const padded = {
            paddingHorizontal: vars.wizardPadding
        };
        const paddedVertical = [padded, {
            paddingVertical: 16
        }];
        return (
            <View style={[{ marginTop: 32 }]}>
                <View style={padded}>
                    <Text style={style.text.title}>{t('title_signupStep2')}</Text>
                    <Text testID="signupStep1Title" style={style.text.subTitle}>{t('title_accountKey')}</Text>
                </View>
                <View style={notice}>
                    {signupState.isInProgress ?
                        <ActivityIndicator size="large" color={vars.white} /> :
                        <View>
                            <Text style={noticeText}>{'Don\'t get'}</Text>
                            <Text style={noticeText2}>{'locked out!'}</Text>
                        </View>}
                </View>
                <View style={paddedVertical}>
                    <Text style={normalText}>
                        {'Peerio doesn\'t use '}
                        <Text style={{ fontStyle: 'italic' }}>
                            {'passwords'}
                        </Text>
                        {' like other apps.'}
                    </Text>
                    <Text style={normalText}>
                        {'This key protects all your info, so keep it safe!'}
                    </Text>
                </View>
                <View style={paddedVertical}>
                    <Text style={normalText}>
                        {'Your Account Key'}
                    </Text>
                    <Text style={passphraseText}>
                        {signupState.passphrase}
                    </Text>
                </View>
                <View style={paddedVertical}>
                    <Text style={normalText}>
                        <Text style={{ fontWeight: 'bold' }}>
                            {'Save this now. '}
                        </Text>
                        {'You\'re going to need it later'}
                    </Text>
                </View>
                <View style={[{ flexGrow: 1 }]} />
            </View>
        );
    }
}
