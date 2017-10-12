import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import AccountUpgradeToggle from './account-upgrade-toggle';
import payments from '../payments/payments';
import { vars } from '../../styles/styles';
import { popupControl } from '../shared/popups';
import { tx } from '../utils/translator';

const topTitleText = {
    fontSize: vars.accountTitleFontSize,
    color: 'white'
};

const boldText = {
    fontWeight: 'bold'
};

const smallText = {
    fontSize: vars.font.size.normal,
    opacity: 0.7,
    color: 'white',
    marginLeft: vars.spacing.normal
};

const featureListText = [topTitleText, {
}];

const featureListTextMedium = [featureListText, {
    fontSize: vars.accountListFontSize
}];

const planFooterInfo = [featureListTextMedium, {
    textAlign: 'center'
}];

const featureSmallText = {
    color: 'white',
    fontSize: vars.font.size.normal,
    fontWeight: 'bold'
};

const block0 = {
    paddingHorizontal: 24
};

const block1 = [block0, {
    marginBottom: 24
}];

const textRow = {
    flexDirection: 'row',
    alignItems: 'center'
};

const borderView = {
    borderColor: '#FFFFFFAA',
    borderBottomWidth: 1,
    paddingBottom: 24,
    paddingHorizontal: vars.spacing.bigger,
    marginHorizontal: 12,
    marginBottom: 24
};

@observer
export default class AccountUpgradePlan extends Component {

    largeSmallTextRow(largeTextString, smallTextString) {
        return (
            <View style={textRow}>
                <Text style={featureListText}>
                    {largeTextString}
                </Text>
                <Text style={smallText}>
                    {smallTextString}
                </Text>
            </View>
        );
    }

    mediumSmallTextRow(largeTextString, smallTextString) {
        return (
            <View style={textRow}>
                <Text style={featureListTextMedium}>
                    {largeTextString}
                </Text>
                <Text style={smallText}>
                    {smallTextString}
                </Text>
            </View>
        );
    }

    featureText(text) {
        return (
            <View style={{ marginBottom: vars.spacing.big }} key={text}>
                <Text style={featureSmallText}>{text}</Text>
            </View>
        );
    }

    get alwaysFree() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1, height: 100 }}>
                <Text style={featureListTextMedium}>{tx('title_alwaysFree')}</Text>
            </View>
        );
    }

    get priceOptions() {
        const { priceOptions, canUpgradeTo, isCurrent } = this.props.plan;
        // if (!priceOptions) return this.alwaysFree;
        if (isCurrent) return <Text style={planFooterInfo}>{tx('title_yourCurrentPlan')}</Text>;
        if (!canUpgradeTo) return <Text style={planFooterInfo}>{tx('title_cannotUpgradePlan')}</Text>;
        return (
            <View style={{ flexDirection: 'row' }}>
                {priceOptions.map(({ title, price, id }, i) => (
                    <AccountUpgradeToggle
                        onPress={() => payments.purchase(id)}
                        text1={price}
                        text2={tx(title).toLowerCase()}
                        left={i === 0}
                        highlight={i > 0} />
                ))}
            </View>
        );
    }

    get footer() {
        return payments.inProgress ? <ActivityIndicator color="white" style={{ marginBottom: 30 }} /> : this.priceOptions;
    }

    subscriptionInfo(text) {
        console.log('subscription info');
        console.log(text);
        const textStyle = {
            color: vars.white,
            fontSize: vars.font.size.normal,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 18
        };
        const popupTextStyle = { color: vars.txtDark, fontSize: vars.font.size.smaller };
        const popup = () => {
            popupControl(
                <ScrollView style={{ flex: 1, flexGrow: 1 }}>
                    <Text style={popupTextStyle}>
                        {text}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://peerio.com/conditions.html')}
                            pressRetentionOffset={vars.pressRetentionOffset}>
                            <Text style={popupTextStyle}>
                                <Text style={{ textDecorationLine: 'underline' }}>
                                    {tx('title_termsOfUse')}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                        <Text style={popupTextStyle}>{'   |   '}</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://peerio.com/privacy.html')}
                            pressRetentionOffset={vars.pressRetentionOffset}>
                            <Text style={popupTextStyle}>
                                <Text style={{ textDecorationLine: 'underline' }}>
                                    {tx('title_privacyPolicy')}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        };
        return (
            <TouchableOpacity onPress={popup} pressRetentionOffset={vars.pressRetentionOffset}>
                <Text style={textStyle}>
                    {`${tx('title_subscriptionDetails')} >`}
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        const { title, includes, info, storage, paymentInfo } = this.props.plan;
        return (
            <View style={{ flexDirection: 'column', flexGrow: 1, flex: 1, justifyContent: 'space-between' }}>
                <ScrollView>
                    <View style={block1}>
                        <Text style={topTitleText}>
                            {tx('title_appName')} <Text style={boldText}>{tx(title)}</Text>
                        </Text>
                    </View>
                    <View style={borderView}>
                        {this.largeSmallTextRow(storage, tx('title_encryptedStorage'))}
                    </View>
                    <View style={block1}>
                        {includes && this.featureText(includes)}
                        {info.split('\n').map(this.featureText)}
                    </View>
                </ScrollView>
                <View style={block1}>
                    {this.footer}
                    {paymentInfo && this.subscriptionInfo(paymentInfo)}
                </View>
            </View>
        );
    }
}

AccountUpgradePlan.propTypes = {
    plan: PropTypes.any
};
