import React from 'react';
import { View, Image } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import DebugMenuTrigger from '../shared/debug-menu-trigger';

const imageWelcome = require('../../assets/welcome-illustration.png');

const pagePadding = vars.spacing.medium.maxi2x;

const page = {
    flex: 1,
    backgroundColor: vars.white,
    paddingBottom: pagePadding
};
const container = {
    paddingHorizontal: pagePadding,
    paddingTop: vars.spacing.large.minix
};
const logoBar = {
    height: vars.welcomeHeaderHeight,
    backgroundColor: vars.darkBlue
};
const welcomeHeader = {
    fontSize: vars.font.size.massive,
    color: vars.darkBlue,
    marginBottom: vars.spacing.medium.midi
};
const welcomeDescription = {
    fontSize: vars.font.size.big,
    color: vars.textBlack54
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
export default class LoginStart extends LoginWizardPage {
    render() {
        return (
            <View style={page}>
                <DebugMenuTrigger>
                    <View style={logoBar}>
                        <Image />
                    </View>
                </DebugMenuTrigger>
                <View style={container}>
                    <View style={{ marginBottom: vars.spacing.medium.mini2x }}>
                        <Text semibold style={welcomeHeader}>{tx('title_loginWelcomeHeader')}</Text>
                        <Text style={welcomeDescription}>{tx('title_loginWelcomeDescription1')}</Text>
                        <Text style={welcomeDescription}>{tx('title_loginWelcomeDescription2')}</Text>
                    </View>
                    <View style={buttonContainer}>
                        {buttons.roundBlueBgButton(tx('button_signup'), () => loginState.routes.app.signupStep1(), null, 'button_signup', { width: 131 })}
                        {buttons.roundWhiteBgButton(tx('button_login'), this.props.login, null, 'button_login', { width: 131 })}
                    </View>
                </View>
                <Image source={imageWelcome} style={imageStyle} resizeMode="contain" />
                <View style={{ alignItems: 'center' }}>
                    <Text semibold>{tx('title_welcomePasswordLink')}</Text>
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
