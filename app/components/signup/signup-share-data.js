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
export default class SignupShareData extends SafeComponent {
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
                    <Text semibold serif style={signupStyles.headerStyle2}>
                        {tx('title_shareUsageData')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_shareUsageDataDescription')}
                    </Text>
                    {/* tos drawers */}
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_notNow'),
                            signupState.next,
                            null,
                            null,
                            'button_notNow')}
                        <View style={{ width: 24 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_share'),
                            signupState.next,
                            null,
                            'button_share')}
                    </View>
                </View>
            </View>
        );
    }
}
