import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
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
import Circles from '../controls/circles';
import styles from '../../styles/styles';

export default class Footer extends Component {
    render() {
        const style = styles.wizard.footer;
        return (
            <View style={styles.container.footer}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.left}>
                        <Text style={style.button.text} onPress={() => Actions.pop()}>EXIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button.right}>
                        <Text style={style.button.text} onPress={() => Actions.signupStep2()}>NEXT</Text>
                    </TouchableOpacity>
                </View>
                <Circles />
            </View>
        );
    }
}

