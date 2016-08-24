import React, { Component } from 'react';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard
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
       const getSceneStyle = (props, computedProps) => {
          const style = {
            backgroundColor: '#2C95CF',
            shadowColor: 'black',
            shadowOffset: { height: 1, width: -1 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          };
          return style;
       };
        return (
            <View style={styles.rootContainer}>
                <KeyboardAwareScrollView keyboardShouldPersistTaps contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Router hideNavBar={true} getSceneStyle={getSceneStyle}>
                        <Scene key="signupStep1" component={LoginStep1} />
                        <Scene key="signupStep2" component={LoginStep2} />
                    </Router>
                    <SignupFooter />
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

