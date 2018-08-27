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
import { TopDrawerBackupAccountKey } from '../shared/top-drawer-components';
import { drawerState } from '../states';
import { socket } from '../../lib/icebear';
import SignupHeading from './signup-heading';
import routes from '../routes/routes';

const buttonContainer = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupCancel extends SafeComponent {
    componentDidMount() {
        if (!signupState.keyBackedUp) {
            drawerState.addDrawer(TopDrawerBackupAccountKey);
        }
    }

    @action.bound cancel() {
        drawerState.dismissAll();
        signupState.exit();
    }

    @action.bound goBack() {
        routes.app.signupStep1();
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <SignupHeading title="title_cancelSignup" subTitle="title_declineExplanation" />
                    <Text semibold style={signupStyles.description}>
                        {tx('title_whyRequired')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_whyRequiredExplanation')}
                    </Text>

                    <Text semibold style={signupStyles.description}>
                        {tx('title_signupAgain')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_signupAgainExplanation')}
                    </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={buttonContainer}>
                            {buttons.blueTextButton(
                                tx('button_yesCancel'),
                                this.cancel,
                                !socket.connected,
                                null,
                                'button_decline')}
                            <View style={{ width: 24 }} />
                            {buttons.roundBlueBgButton(
                                tx('button_goBack'),
                                this.goBack,
                                !socket.connected,
                                'button_accept')}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
