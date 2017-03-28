import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';
import ActivityOverlay from '../controls/activity-overlay';

@observer
export default class LoginStart extends LoginWizardPage {
    buttons() {
        return (
            <View>
                {this.button('login', this.props.login, loginState.isInProgress)}
                {this.button('signup', () => loginState.routes.app.signupStep1(), loginState.isInProgress)}
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
