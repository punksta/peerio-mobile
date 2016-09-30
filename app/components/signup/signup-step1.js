import React, { Component } from 'react';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Linking,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Picker from 'react-native-picker';
import TextBox from '../controls/textbox';
import LanguagePickerBox from '../controls/language-picker-box';
import SignupFooter from '../controls/signup-footer';
import Layout1 from '../layout/layout1';
import styles from '../../styles/styles';
import signupState from './signup-state';
import forms from '../helpers/forms';

@observer
export default class SignupStep1 extends Component {
    constructor(props) {
        super(props);
        forms.mixin(this, signupState);
        this.terms = this.terms.bind(this);
    }

    terms() {
        Linking.openURL('https://www.peerio.com/');
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View style={style.containerFlex}>
                <Text style={style.text.title}>Signup</Text>
                <Text style={style.text.subTitle}>Profile</Text>
                <TextBox {...this.tb('username', 'Username')} />
                <TextBox {...this.tb('email', 'Email')} />
                <LanguagePickerBox {...this.tb('language', 'Language')} />
                <Text style={style.text.info}>
                    By creating a <Text style={{ fontWeight: 'bold' }}>Peerio</Text> account you agree to
                    our <Text style={{ textDecorationLine: 'underline' }} onPress={this.terms}>terms of service</Text>
                </Text>
                <View style={{ flex: 1 }} />
            </View>
        );

        return (
            <Layout1 body={body} footer={<SignupFooter />} />
        );
    }
}
