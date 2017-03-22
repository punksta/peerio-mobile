import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import settingsState from './settings-state';
import { popupInputCancel } from '../shared/popups';
import { t, tx } from '../utils/translator';
import payments from '../payments/payments';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: vars.settingsBg
};

@observer
export default class SettingsLevel2 extends Component {
    twoFactorTest() {
        popupInputCancel(`${tx('popup_enter2FA')}:`);
    }

    security() {
        return (
            <View style={bgStyle}>
                <SettingsItem
                    title={t('twoFactorAuth')}
                    onPress={() => settingsState.transition('twoFactorAuth')} />
                <SettingsItem
                    title="2FA prompt"
                    onPress={() => this.twoFactorTest()} />
                <SettingsItem
                    title={t('passphrase')}
                    icon="visibility"
                    onPress={() => settingsState.showPassphrase()} />
            </View>
        );
    }

    payments() {
        return (
            <View style={bgStyle}>
                <SettingsItem
                    title={t('Test Payment')}
                    onPress={() => payments.test()} />
            </View>
        );
    }

    render() {
        const view = this[settingsState.subroute];
        return view ? view() : null;
    }
}
