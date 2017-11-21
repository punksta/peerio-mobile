import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { t } from '../utils/translator';
import Layout2 from '../layout/layout2';
import Center from '../controls/center';
import Big from '../controls/big';
import Bold from '../controls/bold';
import LoginSavedFooter from './login-saved-footer';
import Pin from '../controls/pin';
import { common, wizard, vars } from '../../styles/styles';
import loginState from './login-state';
import forms from '../helpers/forms';

@observer
export default class LoginSaved extends SafeComponent {
    constructor(props) {
        super(props);
        forms.mixin(this, loginState);
        this.checkPin = this.checkPin.bind(this);
    }

    count = 0;

    checkPin(pin, pinControl) {
        pinControl.spinner(true);
        loginState.login(pin)
            .then(() => { this.count = 0; })
            .catch(() => {
                console.error('login-saved.js: login error');
                setTimeout(() => {
                    pinControl.spinner(false);
                    pinControl.shake();
                }, ++this.count < 3 ? 0 : 10000);
            });
    }

    renderThrow() {
        const style = wizard;
        const body = (
            <View style={[style.containerFlexGrow, { marginTop: vars.spacing.medium.midi2x }]}>
                <Center style={{
                    flexGrow: 0,
                    height: 30 // limit height
                }}>
                    <Big style={common.textInverse}>
                        {t('title_welcomeBack')}
                        {' '}
                        <Bold>{loginState.firstName || loginState.username}</Bold>
                    </Big>
                </Center>
                <Pin
                    inProgress={loginState.isInProgress}
                    messageEnter=" "
                    checkPin={this.checkPin} />
            </View>
        );
        return <Layout2 body={body} footer={<LoginSavedFooter />} />;
    }
}
