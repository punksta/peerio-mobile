import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import tm from '../../telemetry';
import { telemetry } from '../../lib/icebear';

const { S } = telemetry;

@observer
export default class SignupButtonBack extends SafeComponent {
    @action.bound onBackPress() {
        tm.signup.navigate(S.BACK);
        signupState.prev();
    }

    renderThrow() {
        return (
            <View style={signupStyles.backButtonContainer}>
                {icons.basic(
                    'arrow-back',
                    vars.darkBlue,
                    this.onBackPress,
                    { backgroundColor: 'transparent' },
                    null,
                    true,
                    'back')}
            </View>
        );
    }
}
