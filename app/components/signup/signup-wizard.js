import React from 'react';
import {
    View, Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import Layout1 from '../layout/layout1';
import SignupFooter from './signup-footer';
import { wizard } from '../../styles/styles';
import Wizard from '../wizard/wizard';
import SignupStep1 from './signup-step1';
import SignupPin from './signup-pin';
import signupState from './signup-state';

@observer
export default class SignupWizard extends Wizard {
    pages = ['signupStep1', 'signupPin'];

    get index() { return signupState.current; }
    set index(i) { signupState.current = i; }

    footer() {
        return <SignupFooter />;
    }

    signupStep1() {
        return <SignupStep1 />;
    }

    signupPin() {
        return <SignupPin />;
    }

    render() {
        const style = wizard;
        const body = (
            <View
                style={[style.containerFlex]}>
                {this.wizard()}
            </View>
        );
        return <Layout1 body={body} noScroll={signupState.current === 1} footer={this.footer()} />;
    }
}
