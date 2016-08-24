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

export default class LoginStep2 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textTitle}>Signup</Text>
                <Text style={styles.textSubTitle}>More info</Text>
                <TextBox />
                <TextBox />
            </View>
        );
    }
}

