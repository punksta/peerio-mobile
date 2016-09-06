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
import signupState from '../signup/signup-state';
import styles from '../../styles/styles';

export default class SignupFooter extends Component {
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }
    next() {
        console.log('ffff');
        if (signupState.current < signupState.count - 1) {
            signupState.current++;
        } else {
            signupState.finish();
        }
    }
    prev() {
        if (signupState.current > 0) {
            Actions.pop();
            signupState.current--;
        } else {
            signupState.exit();
        }
    }
    render() {
        const style = styles.wizard.footer;
        return (
            <View style={styles.container.footer}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.left} onPress={this.prev}>
                        <Text style={style.button.text}>{signupState.isFirst ? 'EXIT' : 'PREV'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button.right} onPress={this.next}>
                        <Text style={style.button.text}>{signupState.isLast ? 'FINISH' : 'NEXT'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

