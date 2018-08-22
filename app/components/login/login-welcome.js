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
    width: null,
    height: null,
    marginLeft: vars.spacing.large.maxi2x,
    marginRight: vars.spacing.small.maxi,
    marginBottom: vars.spacing.medium.mini2x
};

@observer
export default class LoginWelcome extends SafeComponent {
    @action.bound onSignupPress() {
        loginState.routes.app.signupStep1();
    }

    render() {
        const { onLoginPress } = this.props;
        return (
            <View style={[signupStyles.page, { paddingBottom: pagePadding }]}>
                <DebugMenuTrigger>
                    <View style={logoBar}>
                        <Image />{/*  TODO add Logo */}
                    </View>
                </DebugMenuTrigger>
                <View style={signupStyles.container}>
                    <View style={{ marginBottom }}>
                        <Text semibold style={[signupStyles.headerStyle, { marginBottom }]}>{tx('title_loginWelcomeHeader')}</Text>
                        <Text style={signupStyles.headerDescription}>{tx('title_loginWelcomeDescription1')}</Text>
                        <Text style={signupStyles.headerDescription}>{tx('title_loginWelcomeDescription2')}</Text>
                    </View>
                    <View style={buttonContainer}>
                        {buttons.roundBlueBgButton(
                            tx('button_signup'),
                            this.onSignupPress,
                            null,
                            'button_signup',
                            { width: vars.roundedButtonWidth, marginBottom: vars.spacing.small.midi2x }
                        )}
                        {buttons.roundWhiteBgButton(
                            tx('button_login'),
                            onLoginPress,
                            null,
                            'button_login',
                            { width: vars.roundedButtonWidth }
                        )}
                    </View>
                </View>
                <Image source={imageWelcome} style={imageStyle} resizeMode="contain" />
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
