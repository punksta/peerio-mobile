import React from 'react';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import { View } from 'react-native';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { User } from '../../lib/icebear';

@observer
export default class SignupButtonBack extends SafeComponent {
    @action.bound async onBackPressed() {
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
