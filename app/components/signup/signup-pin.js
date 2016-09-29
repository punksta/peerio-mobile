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
import { observable } from 'mobx';
import TextBox from '../controls/textbox';
import Bold from '../controls/bold';
import SignupFooter from '../controls/signup-footer';
import Pin from '../controls/pin';
import Layout2 from '../layout/layout2';
import styles from '../../styles/styles';
import signupState from './signup-state';

export default class SignupPin extends Component {
    render() {
        const style = styles.wizard;
        const body = (
            <View style={style.containerFlex}>
                <Text style={style.text.title}>Signup</Text>
                <Text style={style.text.subTitle}>Create device PIN</Text>
                <Pin />
            </View>
        );

        return (
            <Layout2 body={body} footer={<SignupFooter />} />
        );
    }
}

