import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import ViewWithDrawer from '../shared/view-with-drawer';
import { TopDrawerBackupAccountKey } from '../shared/top-drawer-components';
import { drawerState, uiState } from '../states';
import { socket } from '../../lib/icebear';
import routes from '../routes/routes';
import TosAccordion from './tos-accordion';

const { height } = Dimensions.get('window');

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
        // TODO check that topDrawerBackupAccountKey isn't already there before adding
        if (!signupState.keyBackedUp) {
            drawerState.addDrawer(TopDrawerBackupAccountKey);
        }
    }

    @action.bound async finishSignup() {
        await signupState.finishAccountCreation();
        uiState.isFirstLogin = true;
        signupState.next();
    }

    renderThrow() {
        return (
            <ViewWithDrawer style={[signupStyles.page, { height }]}>
                <View style={signupStyles.container2}>
                    <Text semibold serif style={signupStyles.headerStyle2}>
                        {tx('title_termsOfUseSentenceCase')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_termsDescription_mobile')}
                    </Text>
                    <TosAccordion />
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_decline'),
                            routes.app.signupCancel,
                            !socket.connected,
                            null,
                            'button_decline')}
                        <View style={{ width: 24 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_accept'),
                            this.finishSignup,
                            !socket.connected,
                            'button_accept')}
                    </View>
                </View>
            </ViewWithDrawer>
        );
    }
}
