import React, { Component } from 'react';
import { View, Text } from 'react-native';
import loginState from './login-state';
import LoginWizardPage, {
    header, inner, title1, title1Black, title2, title2Black, row, circleTop, container
} from './login-wizard-page';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';

export default class LoginStart extends LoginWizardPage {
    get progress() {
        const count = 3;
        const current = 0;
        const circles = [];
        const circleSize = 4;
        const circle = {
            backgroundColor: vars.txtMedium,
            margin: circleSize,
            width: circleSize * 2,
            height: circleSize * 2,
            opacity: 0.3,
            borderRadius: circleSize
        };
        const selected = {
            opacity: 1
        };
        for (let i = 0; i < count; ++i) {
            circles.push(
                <View style={[circle, i === current ? selected : null]} key={i} />
            );
        }
        const circleRow = {
            flexDirection: 'row',
            alignSelf: 'center'
        };
        return <View style={circleRow}>{circles}</View>;
    }

    render() {
        return (
            <View style={container}>
                <View style={header}>
                    <Text style={title1}>Welcome to Peerio</Text>
                    <Text style={title2}>Your private and secure collaboration platform</Text>
                </View>
                <View style={inner}>
                    <View style={circleTop} />
                    <View>
                        <Text style={title1Black}>Private</Text>
                        <Text style={title2Black}>Peerio’s end-to-end encryption keeps your data safe from breaches.</Text>
                    </View>
                    <View style={{ flex: 1, paddingBottom: 20, justifyContent: 'flex-end' }}>
                        {this.progress}
                    </View>
                </View>
                <View style={row}>
                    {this.button('button_login', this.props.login, loginState.isInProgress)}
                    {/* TODO: copy */}
                    {this.button('Sign Up', () => loginState.routes.app.signupStep1(), loginState.isInProgress)}
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
