import React from 'react';
import { View, Image } from 'react-native';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';
import loginState from './login-state';
import ActivityOverlay from '../controls/activity-overlay';
import { vars, signupStyles } from '../../styles/styles';
import buttons from '../helpers/buttons';
import DebugMenuTrigger from '../shared/debug-menu-trigger';
import SafeComponent from '../shared/safe-component';

const imageWelcome = require('../../assets/welcome-illustration.png');

const marginBottom = vars.spacing.medium.mini2x;
const pagePadding = vars.spacing.medium.maxi2x;

const logoBar = {
    height: vars.welcomeHeaderHeight,
    backgroundColor: vars.darkBlue
};
const buttonContainer = {
    marginBottom: vars.spacing.small.maxi,
    alignItems: 'flex-start'
};
const imageStyle = {
    flex: 1,
    flexGrow: 1,
    marginLeft: vars.spacing.large.maxi2x,
    marginRight: vars.spacing.small.maxi,
    marginBottom: vars.spacing.medium.mini2x
};

@observer
export default class LoginWelcome extends SafeComponent {
    @action.bound onSignupPress() {
        loginState.routes.app.signupStep1();
    }

    @action.bound onLoginPress() {
        loginState.routes.app.loginClean();
    }

    render() {
        return (
            <View style={[signupStyles.page, { paddingBottom: pagePadding, flexGrow: 1 }]}>
                <DebugMenuTrigger>
                    <View style={logoBar}>
                        <Image />{/*  TODO add Logo */}
                    </View>
                </DebugMenuTrigger>
                <View style={signupStyles.container}>
                    <View style={{ marginBottom }}>
                        <Text semibold serif style={[signupStyles.headerStyle, { marginBottom }]}>{tx('title_newUserWelcome')}</Text>
                        <Text style={signupStyles.headerDescription}>{tx('title_newUserWelcomeDescription')}</Text>
                    </View>
                    <View style={buttonContainer}>
                        {buttons.roundBlueBgButton(
                            tx('button_CreateAccount'),
                            this.onSignupPress,
                            null,
                            'button_CreateAccount',
                            { width: vars.wideRoundedButtonWidth, marginBottom: vars.spacing.small.midi2x }
                        )}
                        {buttons.roundWhiteBgButton(
                            tx('button_login'),
                            this.onLoginPress,
                            null,
                            'button_login',
                            { width: vars.wideRoundedButtonWidth }
                        )}
                    </View>
                </View>
                <Image source={imageWelcome} style={imageStyle} resizeMode="contain" />
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
