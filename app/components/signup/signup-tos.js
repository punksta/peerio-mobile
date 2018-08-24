import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';

const buttonContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupTos extends SafeComponent {
    @action.bound async finishSignup() {
        await signupState.finishAccountCreation();
        await signupState.finishSignUp();
    }

    renderThrow() {
        return (
            // TODO <ViewWithDrawer />
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <Text semibold serif style={signupStyles.headerStyle2}>
                        {tx('title_termsOfUseSentenceCase')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_termsDescription_mobile')}
                    </Text>
                    {/* tos drawers */}
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_decline'),
                            signupState.prev,
                            null,
                            null,
                            'button_decline')}
                        <View style={{ width: 24 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_accept'),
                            this.finishSignup,
                            null,
                            'button_accept')}
                    </View>
                </View>
            </View>
        );
    }
}
