import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import ToggleItem from './toggle-item';
import { User, clientApp } from '../../lib/icebear';
import { mainState, chatState, settingsState } from '../states';
import { t } from '../utils/translator';
import payments from '../payments/payments';
import PaymentsQuotas from '../payments/payments-quotas';
import ProfileEdit from './profile-edit';
import AccountEdit from './account-edit';
import AccountUpgrade from './account-upgrade';
import keychain from '../../lib/keychain-bridge';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical / 2,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: vars.settingsBg
};

const spacer = {
    height: 24
};

@observer
export default class SettingsLevel2 extends SafeComponent {
    testTwoFactorAuthPrompt(cancelable) {
        clientApp.create2FARequest(cancelable ? 'backupCodes' : 'login',
            (result, trust) => console.log(`settings-level-2.js: ${result}, ${trust}`),
            () => console.log(`settings-level-2.js: cancelled 2fa`));
    }

    security = () => {
        return (
            <View style={bgStyle}>
                <SettingsItem
                    title="title_2FA"
                    onPress={() => settingsState.transition('twoFactorAuth')} />
                {__DEV__ && <SettingsItem
                    title="2FA prompt"
                    onPress={() => this.testTwoFactorAuthPrompt(false)} />}
                {__DEV__ && <SettingsItem
                    title="2FA prompt cancellable"
                    onPress={() => this.testTwoFactorAuthPrompt(true)} />}
                <SettingsItem
                    title="title_showAccountKey"
                    icon="visibility"
                    onPress={() => settingsState.showPassphrase()} />
                {this.touchIdToggle()}
            </View>
        );
    }

    payments() {
        return (
            <View style={bgStyle}>
                <SettingsItem
                    title="test_payment"
                    onPress={() => payments.test()} />
            </View>
        );
    }

    quotas = () => <PaymentsQuotas />;

    profile = () => <ProfileEdit />;

    account = () => <AccountEdit />;

    upgrade = () => <AccountUpgrade />;

    autoLoginToggle() {
        const user = User.current;
        const state = user;
        const prop = 'autologinEnabled';
        const title = 'title_autologinSetting';
        const onPress = () => {
            user.autologinEnabled = !user.autologinEnabled;
            mainState.saveUser();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    touchIdToggle() {
        if (!keychain.available) return null;
        const user = User.current;
        const state = user;
        const prop = 'secureWithTouchID';
        const title = 'dialog_enableTouchID';
        const onPress = () => {
            mainState.saveUserTouchID(!user.secureWithTouchID);
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    preferences = () => {
        const text = {
            color: vars.txtMedium,
            marginBottom: vars.spacing.small.midi2x,
            marginLeft: vars.spacing.small.midi2x
        };

        return (
            <View style={bgStyle}>
                <SettingsItem
                    // TODO Peerio-Copy
                    title="Notifications"
                    onPress={() => settingsState.transition('notifications')} />
                <SettingsItem
                    // TODO Peerio-Copy
                    title="Display"
                    onPress={() => settingsState.transition('display')} />
                {/* <Text style={text}>{t('title_soundsDetail')}</Text> */}
                {/* <ToggleItem title="title_notificationsEmailMessage" /> */}
                <View style={spacer} />
            </View>
        );
    }

    renderThrow() {
        const view = this[settingsState.subroute];
        return view ? view() : null;
    }
}
