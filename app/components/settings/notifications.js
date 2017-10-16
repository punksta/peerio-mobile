import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text } from 'react-native';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import NotificationStore from './notification-store';
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

@observer
export default class Notifications extends SafeComponent {
    // TODO for ALL functions
    // Peerio Copy
    // Change inlineChatContent
    // Change peerioContentEnabled
    dndModeToggle() {
        const state = NotificationStore.prefs;
        const prop = 'doNotDisturbModeEnabled';
        const title = tx('Do not disturb mode');
        const description = tx('Switch off all notifications on this device');
        const onPress = () => {
            state.doNotDisturbModeEnabled = !state.doNotDisturbModeEnabled;
        };
        return (
            <ToggleItem {...{ prop, title, description, state, onPress }} />
        );
    }

    allActivityToggle() {
        const state = NotificationStore.prefs;
        const prop = 'allActivityNotifsEnabled';
        const title = tx('All activity');
        const onPress = () => {
            state.allActivityNotifsEnabled = !state.allActivityNotifsEnabled;
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    directNotificationsToggle() {
        const state = NotificationStore.prefs;
        const prop = 'directNotifsEnabled';
        const title = tx('Direct messages and mentions');
        const onPress = () => {
            state.directNotifsEnabled = !state.directNotifsEnabled;
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    messageContentToggle() {
        const state = NotificationStore.prefs;
        const prop = 'displayMessageContentEnabled';
        const title = tx('Display message content');
        const onPress = () => {
            state.displayMessageContentEnabled = !state.displayMessageContentEnabled;
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    allSoundToggle() {
        const state = NotificationStore.prefs;
        const prop = 'allActivitySoundsEnabled';
        const title = tx('All activity');
        const onPress = () => {
            state.allActivitySoundsEnabled = !state.allActivitySoundsEnabled;
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    allEmailNotificationToggle() {
        const state = NotificationStore.prefs;
        const prop = 'allEmailNotifsEnabled';
        const title = tx('All activity');
        const onPress = () => {
            state.allEmailNotifsEnabled = !state.allEmailNotifsEnabled;
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    newMessageEmailNotificationToggle() {
        const state = NotificationStore.prefs;
        const prop = 'newMessageEmailNotifsEnabled';
        const title = tx('For a new message');
        const onPress = () => {
            state.newMessageEmailNotifsEnabled = !state.newMessageEmailNotifsEnabled;
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    renderThrow() {
        return (
            <View style={bgStyle}>
                <ScrollView>
                    {this.dndModeToggle()}
                    {/* !User.current.settings.dndMode */ true &&
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
                    {/* User.current.settings.dndMode */ false &&
                    <View>
                        {/* Set Schedule */}
                        {/* Small warning */}
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
