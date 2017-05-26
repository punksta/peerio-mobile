import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tu } from '../utils/translator';
import Button from '../controls/button';
import Center from '../controls/center';
import signupState from '../signup/signup-state';
import loginState from '../login/login-state';
import { vars } from '../../styles/styles';

@observer
export default class LoginSignup extends SafeComponent {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
    }

    signUp() {
        if (loginState.isInProgress) return;
        signupState.transition();
    }

    login() {
        loginState.login().catch(e => console.error(e));
    }

    button(text, testId, action) {
        // TODO move to base button styling.
        const bStyle = {
            height: 36,
            marginBottom: 6,
            marginTop: 6,
            paddingLeft: 8,
            paddingRight: 8,
            opacity: loginState.isInProgress ? 0 : 1,
            justifyContent: 'center'
        };
        const textStyle = {
            fontWeight: '600'
        };
        return (
            <Button
                key={text}
                testID={testId}
                style={bStyle}
                disabled={!loginState.isConnected}
                textStyle={textStyle}
                text={tu(text)}
                onPress={action} />
        );
    }

    link(text, testId, action) {
        const bStyle = {
            paddingLeft: 8,
            paddingRight: 8
        };
        const textStyle = {};
        return (
            <Button
                key={text}
                testID={testId}
                style={bStyle}
                disabled={!loginState.isConnected}
                textStyle={textStyle}
                text={tu(text)}
                onPress={action} />
        );
    }


    renderThrow() {
        const center = {
            justifyContent: 'center',
            alignItems: 'center'
        };
        const activityOverlay = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        const activityIndicator = (
            <View style={[activityOverlay, center]}>
                <ActivityIndicator color={vars.highlight} />
            </View>
        );
        const signUp = this.link('signup', 'signupButton', this.signUp);
        return (
            <View style={{ flexGrow: 1, borderColor: 'yellow', borderWidth: 0, justifyContent: 'flex-start' }}>
                <Center>
                    {this.button('login', 'loginButton', this.login)}
                    {loginState.isInProgress && activityIndicator}
                </Center>
                <Center style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255, .7)' }}>New user?</Text>{signUp}
                </Center>
            </View>
        );
    }
}
