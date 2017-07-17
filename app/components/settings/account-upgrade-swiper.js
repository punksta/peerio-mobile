import React, { Component } from 'react';
import { ScrollView, Dimensions, LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import { gradient, bicolor } from '../controls/effects';
import { vars } from '../../styles/styles';
import AccountUpgradeNavigator from './account-upgrade-navigator';
import AccountUpgradePlan from './account-upgrade-plan';
import plans from '../payments/payments-config';

const { width } = Dimensions.get('window');

const card = {
    width,
    backgroundColor: 'transparent',
    paddingTop: vars.statusBarHeight + 30
};

const basicColor = '#82A9BE';
const premiumColor = 'rgba(44,149,207,1)';
const proColor = vars.bgGradient;

const container = { flex: 1, flexGrow: 1, width };

@observer
export default class AccountUpgradeSwiper extends Component {
    @observable selected = 0;

    componentDidMount() {
        reaction(() => this.selected, () => LayoutAnimation.easeInEaseOut());
    }

    jumpTo = (index) => {
        this._scrollView.scrollTo({ x: index * width, y: 0 });
    }

    handleScroll = event => {
        const x = event.nativeEvent.contentOffset.x;
        this.selected = Math.round(x / width);
    }

    render() {
        return bicolor({ style: container }, ([
            <ScrollView
                scrollEventThrottle={0}
                showsHorizontalScrollIndicator={false}
                ref={sv => (this._scrollView = sv)}
                onScroll={this.handleScroll}
                key="scroll" horizontal pagingEnabled removeClippedSubviews={false}>
                {gradient({ style: card }, <AccountUpgradePlan plan={plans[0]} />, basicColor, basicColor)}
                {gradient({ style: card }, <AccountUpgradePlan plan={plans[1]} />, basicColor, premiumColor)}
                {gradient({ style: card }, <AccountUpgradePlan plan={plans[2]} />, premiumColor, proColor)}
            </ScrollView>,
            <AccountUpgradeNavigator key="navigator" selected={this.selected} onJumpTo={this.jumpTo} />
        ]), basicColor, proColor);
    }
}
