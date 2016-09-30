import React from 'react';
import { observable, action, computed, autorun, reaction } from 'mobx';
import SignupCircles from './signup-circles';
import state from '../layout/state';
import Util from '../helpers/util';

const signupState = observable({
    username: '',
    usernameValid: null,
    email: '',
    emailValid: null,
    current: 0,
    count: 0,
    isActive() {
        return state.route.startsWith('signup');
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
        state.routes.main.transition();
    }
});

const signupWizardRoutes = [
    'signupStep1',
    'signupStep2'
];

signupState.count = signupWizardRoutes.length;

state.persistentFooter.signup = (i) => (signupState.isActive ? <SignupCircles key={i} /> : null);

reaction(() => signupState.username, username => {
    signupState.usernameValid = Util.isValidUsername(username);
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

