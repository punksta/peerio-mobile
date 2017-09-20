import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { t } from '../utils/translator';
// import LanguagePickerBox from '../controls/language-picker-box';
import TextBox from '../controls/textbox';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import LoginWizardPage, {
    header, inner, title1, title3, title2, row, container
} from './login-wizard-page';
import { vars } from '../../styles/styles';

const header2 = [header, { marginBottom: 20, justifyContent: 'flex-end' }];
const inner2 = [inner, {
    marginTop: 0,
    backgroundColor: vars.white,
    justifyContent: 'center'
}];
const footer = {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center'
};

const formStyle = {
    padding: 20,
    justifyContent: 'space-between',
    height: 250
};

const findKeyText = {
    alignSelf: 'center',
    color: vars.bg,
    fontSize: 14
};

export default class LoginClean extends LoginWizardPage {
    render() {
        return (
            <View style={container}>
                <View style={header2}>
                    <Text style={title1}>Welcome to Peerio</Text>
                    <Text style={title2}>Sign in</Text>
                </View>
                <View style={inner2}>
                    <View style={formStyle}>
                        <TextBox
                            lowerCase key="usernameLogin"
                            state={loginState}
                            name="username"
                            testID="usernameLogin"
                            hint={t('title_username')} />
                        <TextBox key="usernamePassword"
                            returnKeyType="go"
                            onSubmit={() => this.props.submit()}
                            state={loginState} name="passphrase" hint={t('title_AccountKey')} secureTextEntry />
                        {/* TODO: peerio copy */}
                        {/* TODO: make link active */}
                        <Text style={findKeyText}>Where to find your Account Key</Text>
                    </View>
                </View>
                <View style={[row, { justifyContent: 'flex-end' }]}>
                    {this.button('button_login', () => this.props.submit(), loginState.isInProgress)}
                </View>
                <View style={footer}>
                    {/* TODO: peerio copy */}
                    <Text style={title3}>Create a new account. Sign up here.</Text>
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
