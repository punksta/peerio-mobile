import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { User } from '../../lib/icebear';
import Bold from '../controls/bold';
import settingsState from '../settings/settings-state';
import buttons from '../helpers/buttons';
import plans from '../payments/payments-config';
import { addSystemWarningAction } from '../shared/popups';

@observer
class PaymentStorageUsage extends SafeComponent {
    renderThrow() {
        const u = User.current;
        if (!u) return null;
        const hideUpgrade = plans.userHasPaidPlan() || process.env.PEERIO_DISABLE_PAYMENTS;
        return (
            <View style={{ marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Bold>{u.fileQuotaUsedPercent}% of {u.fileQuotaTotalFmt}</Bold>
                    <View style={{ width: 20 }} />
                    {!hideUpgrade && buttons.uppercaseBlueButton('button_upgrade',
                        () => settingsState.upgrade())}
                </View>
            </View>
        );
    }
}

const paymentCheckout = () => {
    settingsState.upgrade();
    // Linking.openURL('https://www.peerio.com/checkout.html');
};

addSystemWarningAction('UPGRADE', paymentCheckout);

module.exports = { PaymentStorageUsage, paymentCheckout };
