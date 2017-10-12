import React from 'react';
import { reaction, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { ScrollView, View, Text, TextInput, Clipboard, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';
import { popupInputCancelCheckbox } from '../shared/popups';
import { clientApp, User } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import loginState from '../login/login-state';
import TwoFactorAuthCodes from './two-factor-auth-codes';
import TwoFactorAuthCodesGenerate from './two-factor-auth-codes-generate';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;
const marginVertical = 18;
const marginBottom = vars.spacing.normal;

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
    backgroundColor: vars.settingsBg
};

const labelStyle = {
    color: vars.txtDate, marginBottom
};

const whiteStyle = {
    backgroundColor: vars.white, paddingTop: vars.spacing.big, paddingHorizontal
};

async function twoFactorAuthPopup(active2FARequest) {
    if (!active2FARequest) return;
    console.log(JSON.stringify(active2FARequest));
    const { submit, cancel, type } = active2FARequest;
    const result = await popupInputCancelCheckbox(
        tx('title_2FA'),
        tx('dialog_enter2FA'),
        type === 'login' ? tx('title_trustThisDevice') : null,
        false,
        true
    );
    if (result === false) {
        if (type === 'login') {
            await loginState.signOut(true);
        }
        cancel();
        return;
    }
    const { value, checked } = result;
    submit(value, checked);
}

reaction(() => clientApp.active2FARequest, twoFactorAuthPopup);

export { twoFactorAuthPopup };

@observer
export default class TwoFactorAuth extends SafeComponent {
    @observable key2fa;
    @observable confirmCode;
    @observable backupCodes;
    @observable showReissueCodes;

    async componentWillMount() {
        try {
            this.key2fa = await User.current.setup2fa();
            __DEV__ && console.log(`two-factor-auth.js: ${this.key2fa}`);
        } catch (e) {
            // TODO: remove it and depend on SDK
            if (e.code === 400) {
                console.log('two-factor-auth.js: already enabled');
                User.current.twoFAEnabled = true;
            }
        }
        if (User.current.twoFAEnabled) {
            this.showReissueCodes = true;
        }
    }

    copyKey() {
        Clipboard.setString(this.key2fa);
        snackbarState.pushTemporary('2FA key has been copied to clipboard');
    }

    async confirm() {
        const { confirmCode } = this;
        this.confirmCode = null;
        this.backupCodes = await User.current.confirm2faSetup(confirmCode, true);
    }

    get key2FAControl() {
        if (!this.key2fa) return <ActivityIndicator />;
        return (
            <Text style={{ fontWeight: 'bold' }}>
                {this.key2fa}
            </Text>
        );
    }

    renderThrow() {
        if (this.showReissueCodes) return <TwoFactorAuthCodesGenerate />;
        if (this.backupCodes) return <TwoFactorAuthCodes codes={this.backupCodes} />;
        return (
            <ScrollView style={bgStyle}>
                <View>
                    <Text style={{ color: vars.txtDark }}>
                        {tx('title_2FADetailDesktop')}
                    </Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>
                        {tx('title_2FASecretKey')}
                    </Text>
                    <View style={whiteStyle}>
                        {this.key2FAControl}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            {buttons.uppercaseBlueButton(tx('button_2FACopyKey'), () => this.copyKey(), !this.key2fa)}
                        </View>
                    </View>
                </View>
                <View>
                    <Text>
                        {tx('dialog_enter2FA')}
                    </Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>
                        {tx('title_2FACode')}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        backgroundColor: vars.white,
                        paddingHorizontal
                    }}>
                        <TextInput style={{
                            color: vars.txtDark,
                            marginVertical: vars.spacing.normal,
                            height: vars.inputHeight,
                            flexGrow: 1
                        }}
                            placeholderTextColor={vars.txtDate}
                            placeholder="123456"
                            onChangeText={text => { this.confirmCode = text; }}
                            value={this.confirmCode} />
                        {buttons.uppercaseBlueButton(tx('button_confirm'),
                            () => this.confirm(), !this.confirmCode || !this.key2fa)}
                    </View>
                </View>
                <View>
                    <Text style={{ color: vars.txtDark }}>
                        {tx('title_authAppsDetails')}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}
