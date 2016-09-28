import React, { Component } from 'react';
import { Scene, Router, TabBar, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import {
    TouchableOpacity,
    Text,
    TextInput,
    View,
    PanResponder,
    ScrollView
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import LanguagePicker from '../controls/language-picker';
import LanguagePickerBox from '../controls/language-picker-box';
import TextBox from '../controls/textbox';
import Button from '../controls/button';
import Center from '../controls/center';
import Big from '../controls/big';
import Small from '../controls/small';
import Bold from '../controls/bold';
import Logo from '../controls/logo';
import Conditional from '../controls/conditional';
import LoginTermsSignup from './login-terms-signup';
import state from '../layout/state';
import loginState from './login-state';
import styles from '../../styles/styles';
import forms from '../helpers/forms';

@observer
export default class LoginClean extends Component {
    constructor(props) {
        super(props);
        forms.mixin(this, loginState);
        this.signIn = this.signIn.bind(this);
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false
        });
    }

    languagePicker() {
        return <LanguagePicker />;
    }

    signIn() {
        loginState.login();
    }

    render() {
        const style = styles.wizard;
        return (
            <View
                {...this.panResponder.panHandlers}
                style={style.containerFlex}>
                <View>
                    <TextBox {...this.tb('username', 'Name')} />
                    <TextBox
                        secureTextEntry
                        {...this.tb('passphrase', 'Passphrase')} />
                    <LanguagePickerBox {...this.tb('language', 'Language')} />
                </View>
                <Center>
                    <Button text="Sign In" caps bold onPress={this.signIn} />
                </Center>
                <LoginTermsSignup />
            </View>
        );
    }
}
