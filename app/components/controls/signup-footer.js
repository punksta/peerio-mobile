import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react/native';
import { tu } from 'peerio-translator';
import signupState from '../signup/signup-state';
import styles from '../../styles/styles';

@observer
export default class SignupFooter extends Component {
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }
    next() {
        if (signupState.current < signupState.count - 1) {
            signupState.current++;
        } else {
            signupState.finish();
        }
    }
    prev() {
        if (signupState.current > 0) {
            signupState.current--;
        } else {
            signupState.exit();
        }
    }
    render() {
        const style = styles.wizard.footer;
        const nextStyle = signupState.nextAvailable ? { opacity: 1 } : { opacity: 0.7 };
        const next = (
            <TouchableOpacity
                style={[style.button.base, nextStyle]}
                onPress={signupState.nextAvailable ? this.next : null}>
                <Text style={[style.button.text, nextStyle]}>
                    {signupState.isLast ? tu('button_finish') : tu('next')}
                </Text>
            </TouchableOpacity>
        );
        return (
            <View style={style.row}>
                <TouchableOpacity style={style.button.base} onPress={this.prev}>
                    {signupState.isFirst ?
                        <Text style={style.button.text}>
                            {tu('button_exit')}
                        </Text> : <Icon name="arrow-back" size={24} color="#fff" />}
                </TouchableOpacity>
                {next}
            </View>
        );
    }
}

