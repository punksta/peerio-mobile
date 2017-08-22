import React from 'react';
import { reaction, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Text, TextInput, Clipboard, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';
import { popupInputCancel, popupInput } from '../shared/popups';
import { clientApp, User } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import TwoFactorAuthCodes from './two-factor-auth-codes';
import TwoFactorAuthCodesGenerate from './two-factor-auth-codes-generate';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;
const marginVertical = 18;
const marginBottom = 8;

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
    backgroundColor: vars.white, paddingTop: 10, paddingHorizontal
};

async function twoFactorAuthPopup(active2FARequest) {
    if (!active2FARequest) return;
    const { cancelable, submit, cancel } = active2FARequest;
    const fn = cancelable ? popupInputCancel : popupInput;
    const result = await fn(tx('title_2FA'), tx('dialog_enter2FA'));
    if (result === false) {
        cancel();
        return;
    }
    submit(result);
}

reaction(() => clientApp.active2FARequest, twoFactorAuthPopup);

export { twoFactorAuthPopup };

@observer
export default class TwoFactorAuth extends SafeComponent {
    @observable key2fa;
    @observable confirmCode;
    @observable backupCodes = [];
    @observable showGeneratedCodes;
    @observable showReissueCodes;

    async componentWillMount() {
        try {
            this.key2fa = await User.current.setup2fa();
            __DEV__ && console.log(`two-factor-auth.js: ${this.key2fa}`);
        } catch (e) {
            // TODO: remove it and depend on SDK
            if (e.code === 400) {
                console.log('two-factor-auth.js: already enabled');
                this.showReissueCodes = true;
            }
        }
    }

    copyKey() {
        Clipboard.setString(this.key2fa);
        snackbarState.pushTemporary('2FA key has been copied to clipboard');
    }

    async confirm() {
        this.backupCodes = await User.current.confirm2faSetup(this.confirmCode, true);
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
        if (this.showGeneratedCodes) return <TwoFactorAuthCodes />;
        return (
            <View style={bgStyle}>
                <View>
                    <Text style={{ color: vars.txtDark }}>
                        {tx('title_2FADetail')}
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
                            color: vars.txtDate,
                            marginVertical: 8,
                            height: vars.inputHeight,
                            flexGrow: 1
                        }}
                            onChangeText={text => { this.confirmCode = text; }}
                            value={this.confirmCode} />
                        {buttons.uppercaseBlueButton(tx('button_confirm'),
                            () => this.confirm(), !this.confirmCode || !this.key2fa)}
                    </View>
                </View>
            </View>
        );
    }
}
