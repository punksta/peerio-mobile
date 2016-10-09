import React from 'react';
import { observable, action, computed, autorun, reaction } from 'mobx';
import SignupCircles from './signup-circles';
import state from '../layout/state';
import Util from '../helpers/util';
import { User } from '../../lib/icebear';

const signupState = observable({
    username: '',
    usernameValid: null,
    usernameValidationMessage: '',
    email: '',
    emailValid: null,
    emailValidationMessage: 'email should contain @',
    pinSaved: false,
    current: 2,
    count: 0,
    isActive() {
        return state.route.startsWith('signup');
    },
    @computed get nextAvailable() {
        switch (signupState.current) {
            case 0: return this.usernameValid;
            case 1: return this.pinSaved;
            default: return false;
        }
    },
    @computed get isLast() {
        return this.current === this.count - 1;
    },
    @computed get isFirst() {
        return this.current === 0;
    },
    @action transition() {
        state.route = 'signupStep1';
    },
    @action exit() {
        state.route = 'login';
    },
    @action finish() {
        const user = new User();
        user.username = signupState.username;
        user.email = signupState.email;
        user.passphrase = 'such a secret passphrase';
        user.createAccount()
            .then(state.routes.main.transition());
    }
});

const signupWizardRoutes = [
    'signupStep1',
    'signupStep2',
    'signupSpinner'
];

signupState.count = signupWizardRoutes.length;

state.persistentFooter.signup = (i) => (signupState.isActive ? <SignupCircles key={i} /> : null);

reaction(() => signupState.username, username => {
    signupState.usernameValid = Util.isValidUsername(username);
    if (username.length && !signupState.usernameValid) {
        signupState.usernameValidationMessage = 'username not valid';
    }
    if (username.length && signupState.usernameValid) {
        User.validateUsername(username)
            .then(available => {
                signupState.usernameValid = available;
                if (!available) {
                    signupState.usernameValidationMessage = 'username not available';
                }
            });
    }
});

reaction(() => signupState.email, email => {
    signupState.emailValid = Util.isValidEmail(email);
});

autorun(() => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

