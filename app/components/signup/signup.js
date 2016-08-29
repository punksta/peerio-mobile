import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Layout1 from '../layout/layout1';
import SignupFooter from '../controls/signup-footer';
import SignupStep1 from '../signup/signup-step1';
import SignupStep2 from '../signup/signup-step2';
import styles from '../../styles/styles';

export default class Signup extends Component {
    renderBody() {
        return (
            <Router hideNavBar getSceneStyle={() => styles.navigator.card}>
                <Scene key="signupStep1" component={SignupStep1} />
                <Scene key="signupStep2" component={SignupStep2} />
            </Router>
        );
    }
    render() {
        return (
            <Layout1 body={this.renderBody()} footer={<SignupFooter />} />
        );
    }
}

