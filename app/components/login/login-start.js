import React from 'react';
import { View } from 'react-native';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';
import ActivityOverlay from '../controls/activity-overlay';

export default class LoginStart extends LoginWizardPage {
    buttons() {
        return (
            <View>
                {this.button('button_login', this.props.login, loginState.isInProgress)}
                {this.button('button_CreateAccount', () => loginState.routes.app.signupStep1(), loginState.isInProgress)}
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
