import React from 'react';
import { View } from 'react-native';
import Layout1 from '../layout/layout1';
import SignupFooter from './signup-footer';
import { wizard } from '../../styles/styles';
import Wizard from '../wizard/wizard';
import LoginAutomatic from '../login/login-automatic';
import SignupStep1 from './signup-step1';
import SignupAccountKey from './signup-account-key';
import signupState from './signup-state';

export default class SignupWizard extends Wizard {
    pages = ['signupStep1', 'signupAccountKey', 'loginAutomatic'];

    get index() { return signupState.current; }
    set index(i) { signupState.current = i; }

    footer = () => <SignupFooter />;
    signupStep1 = () => <SignupStep1 />;
    signupAccountKey = () => <SignupAccountKey />;
    loginAutomatic = () => <LoginAutomatic />;

    /**
     * Disabling pin on signup
    signupPin() {
        return <SignupPin />;
    } */

    renderThrow() {
        const style = wizard;
        const body = (
            <View
                style={[style.containerFlex]}>
                {this.wizard()}
            </View>
        );
        return <Layout1 body={body} footer={this.footer()} />;
    }
}
