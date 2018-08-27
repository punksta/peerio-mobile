import React from 'react';
import { View, Image, Dimensions, StatusBar } from 'react-native';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';
import loginState from './login-state';
import ActivityOverlay from '../controls/activity-overlay';
import { vars, signupStyles } from '../../styles/styles';
import buttons from '../helpers/buttons';
import DebugMenu from '../shared/debug-menu';
import DebugMenuTrigger from '../shared/debug-menu-trigger';
import SafeComponent from '../shared/safe-component';

const logoWelcome = require('../../assets/peerio-logo-dark.png');
const imageWelcome = require('../../assets/welcome-illustration.png');

const { width } = Dimensions.get('window');

const marginBottom = vars.spacing.medium.mini2x;
const imageWidth = Math.ceil(width - (2 * signupStyles.pagePadding));

const logoBar = {
    height: vars.welcomeHeaderHeight,
    backgroundColor: vars.darkBlue
};
const illustrationStyle = {
    marginLeft: vars.spacing.large.maxi2x,
    marginRight: vars.spacing.small.maxi,
    marginBottom: vars.spacing.medium.mini2x
};
const buttonContainer = {
    marginBottom: vars.spacing.small.maxi,
    alignItems: 'flex-start'
};

@observer
export default class LoginWelcome extends SafeComponent {
    imageStyle(illustration) {
        const asset = Image.resolveAssetSource(illustration);
        const aspectRatio = asset.width / asset.height;
        const imageHeight = Math.ceil(imageWidth / aspectRatio);
        return {
            flex: 1,
            width: imageWidth,
            height: imageHeight
        };
    }

    @action.bound onSignupPress() {
        loginState.routes.app.signupStep1();
    }

    @action.bound onLoginPress() {
        loginState.routes.app.loginClean();
    }

    render() {
        return (
            <View style={[signupStyles.page, { flexGrow: 1 }]}>
                <DebugMenu />
                <DebugMenuTrigger>
                    <View style={logoBar}>
                        <Image source={logoWelcome} resizeMode="contain" style={this.imageStyle(logoWelcome)} />
                    </View>
                </DebugMenuTrigger>
                <View style={[signupStyles.container, { paddingHorizontal: signupStyles.pagePaddingLarge }]}>
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
                            { width: vars.roundedButtonWidth, marginBottom: vars.spacing.small.midi2x }
                        )}
                        {buttons.roundWhiteBgButton(
                            tx('button_login'),
                            this.onLoginPress,
                            null,
                            'button_login',
                            { width: vars.roundedButtonWidth }
                        )}
                    </View>
                </View>
                <Image source={imageWelcome}
                    resizeMode="contain"
                    style={[this.imageStyle(imageWelcome), illustrationStyle]} />
                <ActivityOverlay large visible={loginState.isInProgress} />
                <StatusBar hidden />
            </View>
        );
    }
}
