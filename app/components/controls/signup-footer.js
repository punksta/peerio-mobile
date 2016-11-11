import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
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
        const next = signupState.nextAvailable ?
            <TouchableOpacity style={style.button.right} onPress={this.next}>
                <Text style={style.button.text}>
                    {signupState.isLast ? tu('button_finish') : tu('continue')}
                </Text>
            </TouchableOpacity> : null;
        return (
            <View style={styles.container.footer}>
                <View style={style.row}>
                    <TouchableOpacity style={style.button.left} onPress={this.prev}>
                        <Text style={style.button.text}>
                            {signupState.isFirst ? tu('button_exit') : tu('button_back')}
                        </Text>
                    </TouchableOpacity>
                </View>
                {next}
            </View>
        );
    }
}

