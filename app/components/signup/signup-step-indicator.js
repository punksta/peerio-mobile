import React from 'react';
import { observer } from 'mobx-react/native';
import IntroStepIndicator from '../shared/intro-step-indicator';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';

@observer
export default class SignupStemIndicator extends SafeComponent {
    renderThrow() {
        return <IntroStepIndicator max={3} current={signupState.current} />;
    }
}
