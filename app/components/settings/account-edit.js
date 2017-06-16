import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import ToggleItem from './toggle-item';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import popups from '../shared/popups';
import { User } from '../../lib/icebear';
import { loginState } from '../states';


const label = {
    color: vars.txtDate,
    marginVertical: 4,
    marginLeft: 10
};

const label2 = {
    color: vars.txtDark,
    marginVertical: 8,
    marginLeft: 10,
    marginTop: 16
};


@observer
export default class AccountEdit extends SafeComponent {
    label(title) {
        return <Text style={label}>{tx(title)}</Text>;
    }

    label2(title) {
        return <Text style={label2}>{tx(title)}</Text>;
    }

    toggle(title, prop) {
        const state = User.current.settings;
        const onPress = () => {
            state[prop] = !state[prop];
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    async deleteAccount() {
        if (await popups.popupDeleteAccount()) {
            await User.current.deleteAccount(User.current.username);
            loginState.signOut();
        }
    }

    renderThrow() {
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1, flexGrow: 1 }}
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: vars.settingsBg }} ref={ref => (this._scrollView = ref)}>
                <View style={{ margin: 8 }}>
                    {this.label('title_promoConsentRequestTitle')}
                    {this.toggle('title_promoConsent', 'subscribeToPromoEmails')}
                </View>
                <View style={{ margin: 8 }}>
                    {this.label2('title_dataDetail')}
                    {this.label('title_dataPreferences')}
                    {this.toggle('title_errorTrackingMessage', 'errorTracking')}
                    {this.toggle('title_dataCollectionMessage', 'dataCollection')}
                </View>
                <View style={{ marginTop: 16, marginLeft: 24, marginBottom: 32, flex: 1, flexGrow: 1, justifyContent: 'flex-end' }}>
                    {buttons.uppercaseRedButton('button_accountDelete', () => this.deleteAccount())}
                </View>
            </ScrollView>
        );
    }
}
