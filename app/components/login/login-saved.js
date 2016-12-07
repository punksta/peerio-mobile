import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { t } from '../utils/translator';
import Layout2 from '../layout/layout2';
import Center from '../controls/center';
import Big from '../controls/big';
import Bold from '../controls/bold';
import LoginSavedFooter from './login-saved-footer';
import Pin from '../controls/pin';
import styles from '../../styles/styles';
import loginState from './login-state';
import forms from '../helpers/forms';

export default class LoginSaved extends Component {
    constructor(props) {
        super(props);
        forms.mixin(this, loginState);
        this.checkPin = this.checkPin.bind(this);
    }

    componentDidMount() {
        loginState.triggerTouchId();
    }

    checkPin(pin, pinControl) {
        pinControl.spinner(true);
        loginState.login(pin)
            .catch(() => {
                pinControl.shake();
            });
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View style={style.containerFlex}>
                <Center style={{
                    marginTop: 6,
                    marginBottom: 18
                }}>
                    <Big style={styles.text.inverse}>{t('login_welcomeBack')} <Bold>{loginState.firstName}</Bold></Big>
                </Center>
                <Pin
                    messageEnter={' '}
                    checkPin={this.checkPin} />
            </View>
        );
        return <Layout2 body={body} footer={<LoginSavedFooter />} />;
    }
}

