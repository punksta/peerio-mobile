import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import { observer } from 'mobx-react/native';
import { User } from '../../lib/icebear';
import Bold from '../controls/bold';

@observer
class PaymentStorageUsage extends Component {
    render() {
        const u = User.current;
        if (!u) return null;
        return (
            <View style={{ marginHorizontal: 10 }}>
                <Bold>{u.fileQuotaUsedPercent}% of {u.fileQuotaTotalFmt}</Bold>
            </View>
        );
    }
}

const paymentCheckout = () => {
    console.log('todo: payment action');
    // Linking.openURL('https://www.peerio.com/checkout.html');
};

module.exports = { PaymentStorageUsage, paymentCheckout };
