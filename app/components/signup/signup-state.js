import React, { Component } from 'react';
import _ from 'lodash';
import { observable, asMap, action, computed, autorun } from 'mobx';
import SignupCircles from './signup-circles';
import state from '../layout/state';

const signupState = observable({
    username: '',
    email: '',
    current: 1,
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

autorun(() => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

