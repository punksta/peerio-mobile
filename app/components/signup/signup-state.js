import React, { Component } from 'react';
import _ from 'lodash';
import { observable, asMap, action, computed, autorun } from 'mobx';
import Circles from '../controls/circles';
import state from '../layout/state';

const signupState = observable({
    current: 0,
    count: 5,
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

state.persistentFooter.signup = (i) => (signupState.isActive ? <Circles key={i} /> : null);

autorun(() => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

