import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import TwoFactorAuth from './two-factor-auth';
import settingsState from './settings-state';

@observer
export default class SettingsLevel3 extends SafeComponent {

    twoFactorAuth = () => <TwoFactorAuth />;

    renderThrow() {
        const component = this[settingsState.subroute];
        return component && component();
    }
}
