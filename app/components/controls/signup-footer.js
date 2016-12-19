import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react/native';
import { tu } from 'peerio-translator';
import SignupCircles from '../signup/signup-circles';
import signupState from '../signup/signup-state';
import styles from '../../styles/styles';

const style = styles.wizard.footer;

@observer
export default class SignupFooter extends Component {
    button(text, active, onPress) {
        const s = { opacity: active ? 1 : 0.7 };
        return (
            <TouchableOpacity
                style={style.button.base}
                onPress={active ? onPress : null}>
                <Text style={[style.button.text, s]}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        const next = this.button(
            signupState.isLast ? tu('button_finish') : tu('next'),
            signupState.nextAvailable,
            () => signupState.next()
        );
        const backIcon = <Icon name="arrow-back" size={24} color="#fff" />;
        const prev = this.button(
            signupState.isFirst ? tu('button_exit') : backIcon,
            !signupState.inProgress,
            () => signupState.prev());

        return (
            <View>
                <View style={style.row}>
                    {prev}
                    {next}
                </View>
                <SignupCircles />
            </View>
        );
    }
}

