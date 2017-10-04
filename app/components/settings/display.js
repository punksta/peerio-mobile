import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import { chatState } from '../states';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import { t } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import ToggleItem from './toggle-item';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical / 2,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: vars.settingsBg
};

const spacer = {
    height: 24
};

const text = {
    color: vars.txtMedium,
    marginBottom: 8,
    marginLeft: 8
};

@observer
export default class Display extends SafeComponent {
    settingsItem(title, prop) {
        const user = User.current;
        const state = user.settings;
        const onPress = value => {
            state[prop] = value;
            user.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    renderThrow() {
        return (
            <View style={bgStyle}>
                {/* TODO Continue */}
            </View>
        );
    }
}
