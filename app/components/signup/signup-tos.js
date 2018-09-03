import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { T, tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import ViewWithDrawer from '../shared/view-with-drawer';
import { TopDrawerBackupAccountKey } from '../shared/top-drawer-components';
import { drawerState, uiState } from '../states';
import { socket } from '../../lib/icebear';
import routes from '../routes/routes';
import TosAccordion from './tos-accordion';
import { popupTOS, popupPrivacy } from '../shared/popups';

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
    componentWillMount() {
        // no other drawers in signup except for backup account key, so we can do it
        drawerState.dismissAll();
    }

    componentDidMount() {
        if (!signupState.keyBackedUp) {
            drawerState.addDrawer(TopDrawerBackupAccountKey);
        }
    }

    @action.bound
    async finishSignup() {
        await signupState.finishAccountCreation();
        uiState.isFirstLogin = true;
        signupState.next();
    }

    get content() {
        return (
            <View>
                <Text style={signupStyles.description}>
                    {<T k="title_termsDescription">
                        {{
                            openTerms: this.openTermsLink,
                            openPrivacy: this.openPrivacyLink
                        }}
                    </T>}
                </Text>
                <TosAccordion />
            </View>
        );
    }

    @action.bound openTermsLink(text) {
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={async () => { await popupTOS(); }}>
                {text}
            </Text>
        );
    }

    @action.bound openPrivacyLink(text) {
        return (
            <Text style={{ color: vars.peerioBlue }} onPress={async () => { await popupPrivacy(); }}>
                {text}
            </Text>
        );
    }

    renderThrow() {
        return (
            <ViewWithDrawer style={[signupStyles.page, { height }]}>
                <View style={signupStyles.container2}>
                    <Text semibold serif style={signupStyles.headerStyle2}>
                        {tx('title_termsOfUseSentenceCase')}
                    </Text>
                    {this.content}
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_decline'),
                            routes.app.signupCancel,
                            !socket.connected,
                            null,
                            'button_decline'
                        )}
                        <View style={{ width: 24 }} />
                        {buttons.roundBlueBgButton(
                            tx('button_accept'),
                            this.finishSignup,
                            !socket.connected,
                            'button_accept'
                        )}
                    </View>
                </View>
            </ViewWithDrawer>
        );
    }
}
