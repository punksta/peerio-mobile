import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import TwoFactorAuth from './two-factor-auth';
import Display from './display';
import Notifications from './notifications';
import settingsState from './settings-state';

@observer
export default class SettingsLevel3 extends SafeComponent {

    twoFactorAuth = () => <TwoFactorAuth />;

    display = () => <Display />;

    notifications = () => <Notifications />;

    renderThrow() {
        const component = this[settingsState.subroute];
        return component && component();
    }
}
