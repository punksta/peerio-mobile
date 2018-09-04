import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, StatusBar } from 'react-native';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import { vars, signupStyles } from '../../styles/styles';
import signupState from '../signup/signup-state';
import { User, telemetry } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import SignupHeading from '../signup/signup-heading';
import IntroStepIndicator from '../shared/intro-step-indicator';
import TmHelper from '../../telemetry/helpers';
import tm from '../../telemetry';
import LoginInputs from './login-inputs';
import icons from '../helpers/icons';

const { S } = telemetry;

@observer
export default class LoginClean extends SafeComponent {
    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.SIGN_IN;
    }

    componentWillUnmount() {
        tm.login.duration(this.startTime);
    }

    @action.bound async onBackPressed() {
        tm.login.navigate(S.BACK);
        signupState.prev();
        await User.removeLastAuthenticated();
    }

    get backButton() {
        return (
            <View style={signupStyles.backButtonContainer}>
                {icons.basic(
                    'arrow-back',
                    vars.darkBlue,
                    this.onBackPressed,
                    { backgroundColor: 'transparent' },
                    null,
                    true,
                    'back')}
            </View>
        );
    }

    render() {
        return (
            <View style={signupStyles.page}>
                <IntroStepIndicator max={1} current={1} />
                <View style={signupStyles.container}>
                    {this.backButton}
                    <SignupHeading title="title_welcomeBack" />
                    <LoginInputs />
                </View>
                <StatusBar hidden />
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
