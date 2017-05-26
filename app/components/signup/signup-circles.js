import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import signupState from '../signup/signup-state';
import Circles from '../controls/circles';

@observer
export default class SignupCircles extends SafeComponent {
    renderThrow() {
        return (
            <Circles count={signupState.count} current={signupState.current} />
        );
    }
}

