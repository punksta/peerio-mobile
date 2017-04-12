import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { t } from '../utils/translator';
import Pin from '../controls/pin';
import styles from '../../styles/styles';
import signupState from './signup-state';

export default class SignupPin extends Component {

    usePin(pin) {
        signupState.pin = pin;
        this.pin.spinner(true);
        signupState.finish();
    }

    render() {
        const style = styles.wizard;
        return (
            <View style={{ flexGrow: 1, marginTop: 32 }}>
                <Text style={style.text.title}>{t('title_signupStep2')}</Text>
                <Pin
                    preventSimplePin
                    messageInitial={t('passcode_inputPlaceholder')}
                    ref={pin => (this.pin = pin)}
                    onConfirm={pin => this.usePin(pin)} />
            </View>
        );
    }
}
