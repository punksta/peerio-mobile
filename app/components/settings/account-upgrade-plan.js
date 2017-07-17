import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import AccountUpgradeToggle from './account-upgrade-toggle';
import { vars } from '../../styles/styles';


const topTitleText = {
    fontSize: 37,
    color: 'white'
};

const boldText = {
    fontWeight: 'bold'
};

const smallText = {
    fontSize: 14,
    opacity: 0.7,
    color: 'white',
    marginLeft: 8
};

const featureListText = [topTitleText, {
}];

const featureListTextMedium = [featureListText, {
    fontSize: 21
}];

const featureSmallText = {
    color: 'white',
    fontSize: 14,
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
    paddingHorizontal: 12,
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
            <View style={{ marginBottom: 10 }} key={text}>
                <Text style={featureSmallText}>{text}</Text>
            </View>
        );
    }

    get alwaysFree() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1, height: 100 }}>
                <Text style={featureListTextMedium}>Always free!</Text>
            </View>
        );
    }

    get priceOptions() {
        const { priceOptions } = this.props.plan;
        if (!priceOptions) return this.alwaysFree;
        return priceOptions.map(({ title, price }, i) =>
            <AccountUpgradeToggle text1={price} text2={title.toLowerCase()} left={i === 0} highlight={i > 0} />);
    }

    render() {
        const { title, includes, info, storage } = this.props.plan;
        return (
            <View style={{ flexDirection: 'column', flexGrow: 1, flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <View style={block1}>
                        <Text style={topTitleText}>
                            Peerio <Text style={boldText}>{title}</Text>
                        </Text>
                    </View>
                    <View style={borderView}>
                        {this.largeSmallTextRow(storage, 'Encrypted storage')}
                        {/* this.mediumSmallTextRow(uploadFileSize, 'Max file size') */}
                    </View>
                    <View style={block1}>
                        {includes && this.featureText(includes)}
                        {info.split('\n').map(this.featureText)}
                    </View>
                </View>
                <View style={block1}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.priceOptions}
                    </View>
                </View>
            </View>
        );
    }
}

AccountUpgradePlan.propTypes = {
    plan: PropTypes.any
};
