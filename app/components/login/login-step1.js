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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Picker from 'react-native-picker';
import { styles } from '../../styles/styles';

export default class LoginStep1 extends Component {
    render() {
        var style = styles.wizard;
        return (
            <View style={style.container}>
                <Text style={style.text.title}>Signup</Text>
                <Text style={style.text.subTitle}>Profile</Text>
                <TextBox />
                <TextBox />
                <TextBox />
                <TextBox />
                <Text style={style.text.info}>
                    By creating a <Text style={{ fontWeight: 'bold' }}>Peerio</Text> account you agree to
                    our <Text style={{ textDecorationLine: 'underline' }}>terms of service</Text>
                </Text>
            </View>
        );
    }
}

