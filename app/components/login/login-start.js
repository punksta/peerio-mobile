import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import state from '../layout/state';
import LoginWizardPage from './login-wizard-page';

@observer
export default class LoginStart extends LoginWizardPage {
    buttons() {
        return [
            this.button('login', this.props.login),
            this.button('signup', () => state.routes.signupStep1.transition())
        ];
    }
}
