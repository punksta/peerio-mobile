import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Text, TextInput, Clipboard } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import ButtonText from '../controls/button-text';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';
import { popupInputCancel, popupInput } from '../shared/popups';
import { clientApp } from '../../lib/icebear';

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
    key2fa = `FY5DGKRMJHXCLJDJJAOISDUUSIA`;

    copyKey() {
        Clipboard.setString(this.key2fa);
        snackbarState.pushTemporary('2FA key has been copied to clipboard');
    }

    renderThrow() {
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
                        <Text style={{ fontWeight: 'bold' }}>
                            {this.key2fa}
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            <ButtonText text={tx('button_2FACopyKey')} onPress={() => this.copyKey()} />
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
                        }} value="123456" />
                        <ButtonText text={tx('button_confirm')} />
                    </View>
                </View>
            </View>
        );
    }
}
