import React, { Component } from 'react';
import { ScrollView, Dimensions, LayoutAnimation, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import { gradient, bicolor } from '../controls/effects';
import { vars } from '../../styles/styles';
import AccountUpgradeNavigator from './account-upgrade-navigator';
import AccountUpgradePlan from './account-upgrade-plan';
import plans from '../payments/payments-config';
import icons from '../helpers/icons';
import routerModal from '../routes/router-modal';
import { User } from '../../lib/icebear';
import { t } from '../utils/translator';
import { popupYes } from '../shared/popups';

const { width } = Dimensions.get('window');

const card = {
    width,
    backgroundColor: 'transparent',
    paddingTop: 36
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
        setTimeout(() => this._scrollView.scrollToEnd({ animated: false }), 0);
        if (User.current) {
            console.log('account-upgrade-swiper: active plans');
            User.current && console.log(User.current.activePlans);
            if (User.current.addresses.filter(e => e.confirmed).length === 0) {
                popupYes('', '', t('error_upgradingAccountNoConfirmedEmail')).then(() => routerModal.discard());
            }
        }
    }

    jumpTo = (index, skipAnimated) => {
        this._scrollView.scrollTo({ x: index * width, y: 0, animated: !skipAnimated });
    }

    handleScroll = event => {
        const x = event.nativeEvent.contentOffset.x;
        this.selected = Math.round(x / width);
    }

    get exitRow() {
        const s = {
            position: 'absolute',
            top: vars.statusBarHeight + 12,
            right: 12
        };
        return (
            <View style={s} key="exitRow">
                {icons.white('close', () => routerModal.discard(), { backgroundColor: 'transparent' })}
            </View>
        );
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
            this.exitRow,
            <AccountUpgradeNavigator key="navigator" selected={this.selected} onJumpTo={this.jumpTo} />
        ]), basicColor, proColor);
    }
}
