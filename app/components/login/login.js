import React, { Component } from 'react';
import { Scene, Router, TabBar, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    Modal
} from 'react-native';
import TextBox from '../controls/textbox';
import SignupFooter from '../controls/signup-footer';
import LoginStep1 from './login-step1';
import LoginStep2 from './login-step2';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Picker from 'react-native-picker';
import { styles } from '../../styles/styles';

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container.root}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Router hideNavBar={true} getSceneStyle={() => styles.navigator.card}>
                        <Scene key="signupStep1" component={LoginStep1} />
                        <Scene key="signupStep2" component={LoginStep2} />
                    </Router>
                    <SignupFooter />
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

