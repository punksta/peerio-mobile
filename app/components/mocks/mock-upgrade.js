import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import AccountUpgradeSwiper from '../settings/account-upgrade-swiper';

@observer
export default class MockUpgrade extends Component {
    render() {
        return <AccountUpgradeSwiper />;
    }
}
