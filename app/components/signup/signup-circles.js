import React, { Component } from 'react';
import SafeComponent from '../shared/safe-component';
import signupState from '../signup/signup-state';
import Circles from '../controls/circles';

export default class SignupCircles extends SafeComponent {
    renderThrow() {
        return (
            <Circles count={signupState.count} current={signupState.current} />
        );
    }
}

