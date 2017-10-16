import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text } from 'react-native';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
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
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('Do not disturb mode');
        const description = tx('Switch off all notifications on this device');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, description, state, onPress }} />
        );
    }

    allActivityToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('All activity');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    directNotificationsToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('Direct messages and mentions');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    messageContentToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('Display message content');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    allSoundToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('All activity');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    directNotificationsSoundToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('Direct messages and mentions');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    allEmailNotificationToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('All activity');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    newMessageEmailNotificationToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = tx('All activity');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
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
                        {this.directNotificationsSoundToggle()}
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
