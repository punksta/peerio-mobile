import React from 'react';
import { observer } from 'mobx-react/native';
import IntroStepIndicator from '../../shared/intro-step-indicator';
import signupState from '../../signup/signup-state';
import SafeComponent from '../../shared/safe-component';

@observer
export default class SignupStepIndicatorMedcryptor extends SafeComponent {
    renderThrow() {
        return <IntroStepIndicator max={5} current={signupState.current} />;
    }
}
