import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import ToggleItem from './toggle-item';
import { User } from '../../lib/icebear';
import { mainState, chatState, settingsState } from '../states';
import { popupInputCancel } from '../shared/popups';
import { t, tx } from '../utils/translator';
import payments from '../payments/payments';
import PaymentsQuotas from '../payments/payments-quotas';
import ProfileEdit from './profile-edit';

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
    twoFactorTest() {
        popupInputCancel(`${tx('dialog_enter2FA')}:`);
    }

    security = () => {
        const user = User.current;
        return (
            <View style={bgStyle}>
                {/* <SettingsItem
                    title={t('title_2FA')}
                    onPress={() => settingsState.transition('twoFactorAuth')} />
                <SettingsItem
                    title="2FA prompt"
                    onPress={() => this.twoFactorTest()} /> */}
                <SettingsItem
                    title="title_showAccountKey"
                    icon="visibility"
                    onPress={() => settingsState.showPassphrase()} />
                {this.autoLoginToggle()}
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

    settingsItem(title, prop) {
        const user = User.current;
        const state = user.settings;
        const onPress = value => {
            state[prop] = value;
            user.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

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

    unreadChatsToggle() {
        const state = chatState.store;
        const prop = 'unreadChatsAlwaysOnTop';
        const title = 'title_unreadChatsOnTopDetail';
        const onPress = () => {
            state.unreadChatsAlwaysOnTop = !state.unreadChatsAlwaysOnTop;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    preferences = () => {
        const text = {
            color: vars.txtMedium,
            marginBottom: 8,
            marginLeft: 8
        };

        return (
            <View style={bgStyle}>
                <Text style={text}>{t('title_emailsDetail')}</Text>
                {this.settingsItem('title_notificationsEmailMessage', 'messageNotifications')}
                <View style={spacer} />
                {this.settingsItem('title_promoConsent', 'subscribeToPromoEmails')}
                <View style={spacer} />
                {this.unreadChatsToggle()}
                <View style={spacer} />
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
