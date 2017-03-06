import React, { Component } from 'react';
import {
    Text, ActivityIndicator, View
} from 'react-native';
import { observer } from 'mobx-react/native';
import { t, T } from '../utils/translator';
import TextBox from '../controls/textbox';
import Bold from '../controls/bold';
import Center from '../controls/center';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';
import { vars } from '../../styles/styles';

const textStyle = {
    marginBottom: 12,
    color: vars.txtLight
};

@observer
export default class LoginPassword extends LoginWizardPage {
    items() {
        const textParser = {
            emphasis: text => <Bold>{text}</Bold>
        };
        return [
            <Text style={textStyle}><T k="login_masterPassword1">{textParser}</T></Text>,
            <Text style={textStyle}><T k="login_masterPassword2">{textParser}</T></Text>,
            <TextBox state={loginState} name="passphrase" hint={t('passphrase')} secureTextEntry />
        ];
    }


    buttons() {
        const center = {
            justifyContent: 'center',
            alignItems: 'center'
        };
        const activityOverlay = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        const activityIndicator = (
            <View style={[activityOverlay, center]}>
                <ActivityIndicator color={vars.highlight} />
            </View>
        );
        const opacity = loginState.isInProgress ? 0 : 1;
        return (
            <Center>
                {this._footerButton('login', () => this.props.submit(), { opacity })}
                {loginState.isInProgress && activityIndicator}
            </Center>
        );
    }
}
