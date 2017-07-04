import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tx, tu } from '../utils/translator';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import { User } from '../../lib/icebear';
import payments from '../payments/payments';

const margin = 18;
const marginLeft = margin;
const marginBottom = 12;
const paddingWhite = 10;
const marginWhite = margin - paddingWhite;

const smallLabel = {
    color: vars.txtDate,
    fontSize: 10
};

const boldLabel = {
    color: vars.txtDark,
    fontWeight: 'bold',
    fontSize: 16
};

const mediumLabel = {
    color: vars.txtDate,
    fontSize: 14
};

const descLabel = {
    color: vars.txtDark,
    fontSize: 12
};

const descIncludesLabel = [descLabel, {
    fontStyle: 'italic',
    marginBottom: margin
}];

const basicPlanInfo =
`Secure Messaging
90 day message archives
Portability across devices
Secure File Storage & Sharing
1 GB of secure Peerio Vault storage
500M max upload file size`;

const premiumIncludesInfo =
`Includes features of Basic Plan`;

const premiumPlanInfo =
`20 GB of secure storage
2 GB max upload file size
Unlimited Message Archive`;

const professionalIncludesInfo =
`Includes features of Premium and Basic Plans`;

const professionalPlanInfo =
`500 GB of secure storage
Unlimited upload file size
Unlimited Message Archive`;

const plans = [{
    title: 'Basic',
    price: 'Free',
    info: basicPlanInfo,
    isCurrent: true,
    canUpgradeTo: false
}, {
    title: 'Premium',
    priceOptions: [{
        title: 'yearly',
        iosID: 'com.peerio.storage.50.yearly',
        price: '$2.99/month'
    }, {
        title: 'monthly',
        iosID: 'com.peerio.storage.50.monthly',
        price: '$3.99/month'
    }],
    includes: premiumIncludesInfo,
    info: premiumPlanInfo,
    canUpgradeTo: true
}, {
    title: 'Professional',
    priceOptions: [{
        title: 'yearly',
        iosID: 'com.peerio.storage.50.yearly',
        price: '$9.99/month'
    }, {
        title: 'monthly',
        iosID: 'com.peerio.storage.50.monthly',
        price: '$12.99/month'
    }],
    includes: professionalIncludesInfo,
    info: professionalPlanInfo,
    canUpgradeTo: true
}];

@observer
export default class AccountUpgrade extends SafeComponent {
    titleBlock(boldText, normalText, rightBlock) {
        return (
            <View style={{ margin, marginBottom, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>
                    <Text style={boldLabel}>{boldText}</Text>
                    <Text>{' - '}</Text>
                    <Text style={mediumLabel}>{normalText}</Text>
                </Text>
                {rightBlock}
            </View>
        );
    }

    label(title) {
        return <Text style={smallLabel}>{tx(title)}</Text>;
    }

    renderButton1(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingTop: 2 }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.bg }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

    renderPlan = (plan) => {
        let actionButton = null;
        if (plan.isCurrent) actionButton = <Text style={smallLabel}>(current)</Text>;
        let price = plan.price;
        if (plan.priceOptions && plan.priceOptions.length) {
            const priceOptions = plan.priceOptions[0];
            price = priceOptions.price;
            if (!plan.isCurrent && plan.canUpgradeTo) {
                actionButton = this.renderButton1(
                    'button_upgrade', () => payments.purchase(priceOptions.iosID)
                );
            }
        }
        return (
            <View key={plan.title}>
                {this.titleBlock(
                    plan.title,
                    price,
                    actionButton
                )}
                <View style={{ marginLeft }}>
                    {this.label('Features')}
                </View>
                <View style={{ backgroundColor: vars.white, margin: marginWhite, padding: paddingWhite }}>
                    {plan.includes && <Text style={descIncludesLabel}>{plan.includes}</Text>}
                    <Text style={descLabel}>{plan.info}</Text>
                </View>
            </View>
        );
    }

    renderThrow() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: vars.settingsBg }}>
                {plans.map(this.renderPlan)}
            </ScrollView>
        );
    }
}
