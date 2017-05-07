import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { tu } from 'peerio-translator';

import signupState from '../signup/signup-state';
import styles from '../../styles/styles';

const style = styles.wizard.footer;

@observer
export default class SignupFooter extends Component {
    button(text, active, onPress, testID) {
        const s = { opacity: active ? 1 : 0.7 };
        return (
            <TouchableOpacity
                testID={testID}
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
            signupState.isLast ? tu('') : tu('button_next'),
            !signupState.isInProgress && signupState.nextAvailable,
            () => signupState.next(),
            'signupNext'
        );

        const prev = this.button(
            signupState.isFirst ? tu('button_cancel') : tu('button_back'),
            !signupState.isInProgress,
            () => signupState.prev(), 'signupPrev');

        return (
            <View style={{ marginVertical: 16 }}>
                <View style={style.row}>
                    {prev}
                    {next}
                </View>
            </View>
        );
    }
}
