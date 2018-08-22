import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import { signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';

@observer
export default class SignupTos extends SafeComponent {
    @action.bound handleAcceptButton() {
        signupState.next();
    }

    @action.bound handleDeclineButton() {
        // cancel signup modal
    }

    renderThrow() {
        return (
            // TODO <ViewWithDrawer />
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <Text semibold style={signupStyles.headerStyle2}>
                        {tx('title_tos')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_tosDescription')}
                    </Text>
                    {/* tos drawers */}
                    {/* buttons */}
                </View>
            </View>
        );
    }
}
