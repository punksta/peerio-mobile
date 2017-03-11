import React, { Component } from 'react';
import {
    View, Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { reaction } from 'mobx';
import Layout1 from '../layout/layout1';
import Button from '../controls/button';
import SignupFooter from './signup-footer';
import styles, { vars } from '../../styles/styles';
import Wizard from '../wizard/wizard';
import SignupStep1 from './signup-step1';
import SignupPin from './signup-pin';
import signupState from './signup-state';
import { tu } from '../utils/translator';

const { height } = Dimensions.get('window');

@observer
export default class SignupWizard extends Wizard {
    pages = ['signupStep1', 'signupPin'];

    constructor(props) {
        super(props);
        reaction(() => signupState.current, () => (this.index = signupState.current));
    }

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
        const style = styles.wizard;
        const body = (
            <View
                style={[style.containerFlex, { height }]}>
                {this.wizard()}
                {this.footerContainer()}
            </View>
        );
        return <Layout1 body={body} footer={null} />;
    }
}
