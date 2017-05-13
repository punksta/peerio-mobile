import React, { Component } from 'react';
import { Text } from 'react-native';
import { observer } from 'mobx-react/native';
import { t, T } from '../utils/translator';
import TextBox from '../controls/textbox';
import Bold from '../controls/bold';
import Center from '../controls/center';
import ActivityOverlay from '../controls/activity-overlay';
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
            <Text style={textStyle}><T k="title_AKlogin">{textParser}</T></Text>,
            <TextBox state={loginState} name="passphrase" hint={t('title_AccountKey')} secureTextEntry />
        ];
    }


    buttons() {
        const opacity = loginState.isInProgress ? 0 : 1;
        return (
            <Center>
                {this._footerButton('login', () => this.props.submit(), { opacity })}
                <ActivityOverlay visible={loginState.isInProgress} />
            </Center>
        );
    }
}
