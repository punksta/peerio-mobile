import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import ToggleItem from './toggle-item';
import { User } from '../../lib/icebear';
import settingsState from './settings-state';
import { popupInputCancel } from '../shared/popups';
import { t, tx } from '../utils/translator';
import payments from '../payments/payments';
import PaymentsQuotas from '../payments/payments-quotas';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical / 2,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: vars.settingsBg
};

@observer
export default class SettingsLevel2 extends Component {
    twoFactorTest() {
        popupInputCancel(`${tx('dialog_enter2FA')}:`);
    }

    security() {
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
                    disabled={!user.autologinEnabled}
                    onPress={() => settingsState.showPassphrase()} />
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

    quotas() {
        return <PaymentsQuotas />;
    }

    profile() {
        return (
            <View><Text>Profile</Text></View>
        );
    }

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

    preferences = () => {
        const text = {
            color: vars.txtMedium,
            marginBottom: 8,
            marginLeft: 8
        };
        const spacer = {
            height: 24
        };

        return (
            <View style={bgStyle}>
                <Text style={text}>{t('title_emailsDetail')}</Text>
                {this.settingsItem('title_notificationsEmailMessage', 'messageNotifications')}
                <View style={spacer} />
                {this.settingsItem('title_promoConsent', 'subscribeToPromoEmails')}
                <View style={spacer} />
                {/* <Text style={text}>{t('title_soundsDetail')}</Text> */}
                {/* <ToggleItem title="title_notificationsEmailMessage" /> */}
                <View style={spacer} />
            </View>
        );
    }

    render() {
        const view = this[settingsState.subroute];
        return view ? view() : null;
    }
}
