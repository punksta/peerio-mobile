import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text } from 'react-native';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import PreferenceStore from './preference-store';
import { t, tx } from '../utils/translator';
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

const state = PreferenceStore.prefs;

@observer
export default class Notifications extends SafeComponent {
    preferenceToggleItem(prop, title, description) {
        const onPress = () => { state[prop] = !state[prop]; };
        return (
            <ToggleItem {...{ prop, title, description, state, onPress }} />
        );
    }

    // Pref names can be found in preference-store.js
    dndModeToggle() {
        return (this.preferenceToggleItem(
            'doNotDisturbModeEnabled',
            tx('Do not disturb mode'),
            tx('Switch off all notifications on this device')
        ));
    }

    allActivityToggle() {
        return (this.preferenceToggleItem(
            'allActivityNotifsEnabled',
            tx('All activity'),
        ));
    }

    directNotificationsToggle() {
        return (this.preferenceToggleItem(
            'directNotifsEnabled',
            tx('Direct messages and mentions'),
        ));
    }

    messageContentToggle() {
        return (this.preferenceToggleItem(
            'displayMessageContentEnabled',
            tx('Display message content'),
        ));
    }

    allSoundToggle() {
        return (this.preferenceToggleItem(
            'allActivitySoundsEnabled',
            tx('All activity'),
        ));
    }

    allEmailNotificationToggle() {
        return (this.preferenceToggleItem(
            'allEmailNotifsEnabled',
            tx('All activity'),
        ));
    }

    newMessageEmailNotificationToggle() {
        return (this.preferenceToggleItem(
            'newMessageEmailNotifsEnabled',
            tx('For a new message'),
        ));
    }

    renderThrow() {
        return (
            <View style={bgStyle}>
                <ScrollView>
                    {this.dndModeToggle()}
                    { !state.doNotDisturbModeEnabled &&
                    <View>
                        <View style={spacer} />
                        <Text style={text}>{tx('Notify of:')}</Text>
                        {this.allActivityToggle()}
                        {this.directNotificationsToggle()}
                        {/* TODO Specific Keywords implementation */}

                        <View style={spacer} />
                        <Text style={text}>{tx('Message preview on lock screen')}</Text>
                        {this.messageContentToggle()}

                        <View style={spacer} />
                        <Text style={text}>{tx('Play sound')}</Text>
                        {this.allSoundToggle()}
                    </View>}
                    <View style={spacer} />
                    <Text style={text}>{tx('Email notifications')}</Text>
                    {this.allEmailNotificationToggle()}
                    {this.newMessageEmailNotificationToggle()}
                </ScrollView>
            </View>
        );
    }
}
