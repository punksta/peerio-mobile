import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { t } from '../utils/translator';
import SignupFooter from '../controls/signup-footer';
import Pin from '../controls/pin';
// import Button from '../controls/button';
import Layout2 from '../layout/layout2';
import styles from '../../styles/styles';
import signupState from './signup-state';

export default class SignupPin extends Component {

    usePin(pin) {
        signupState.pin = pin;
        this.pin.spinner(true);
        setTimeout(() => signupState.finish(), 200);
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View style={[style.containerFlex, { marginTop: 32 }]}>
                <Text style={style.text.title}>{t('signup')}</Text>
                <Pin
                    preventSimplePin
                    ref={pin => (this.pin = pin)}
                    onConfirm={pin => this.usePin(pin)} />
            </View>
        );

        return (
            <Layout2 body={body} footer={<SignupFooter />} />
        );
    }
}
