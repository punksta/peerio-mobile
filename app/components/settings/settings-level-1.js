import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import settingsState from './settings-state';
import { t } from '../utils/translator';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: vars.settingsBg
};

@observer
export default class SettingsLevel1 extends Component {
    render() {
        return (
            <View style={bgStyle}>
                <SettingsItem title={t('profile')} disabled />
                <SettingsItem title={t('security')} onPress={() => settingsState.transition('security')} />
                <SettingsItem title={t('preferences')} disabled />
            </View>
        );
    }
}
