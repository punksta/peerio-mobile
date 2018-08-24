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
import ViewWithDrawer from '../shared/view-with-drawer';
import { TopDrawerBackupAccountKey } from '../shared/top-drawer-components';
import { drawerState } from '../states';
import routes from '../routes/routes';

const buttonContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupTos extends SafeComponent {
    componentDidMount() {
        if (!signupState.keyBackedUp) {
            drawerState.addDrawer(TopDrawerBackupAccountKey);
        }
    }

    @action.bound async finishSignup() {
        await signupState.finishAccountCreation();
        await signupState.finishSignUp();
    }

    @action.bound declineTos() {
        drawerState.dismissAll();
        signupState.exit();
    }

    renderThrow() {
        return (
            // TODO <ViewWithDrawer />
            <ViewWithDrawer style={signupStyles.page}>
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
                            this.declineTos,
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
            </ViewWithDrawer>
        );
    }
}
