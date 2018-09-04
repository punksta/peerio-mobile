import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { User, telemetry } from '../../lib/icebear';
import tm from '../../telemetry';

const { S } = telemetry;

@observer
export default class SignupButtonBack extends SafeComponent {
    @action.bound async onBackPressed() {
        tm.signup.navigate(S.BACK);
        signupState.prev();
        if (this.props.clearLastUser) await User.removeLastAuthenticated();
    }

    renderThrow() {
        return (
            <View style={signupStyles.backButtonContainer}>
                {icons.basic(
                    'arrow-back',
                    vars.darkBlue,
                    this.onBackPressed,
                    { backgroundColor: 'transparent' },
                    null,
                    true,
                    'back')}
            </View>
        );
    }
}
