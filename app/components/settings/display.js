import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import { chatState } from '../states';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import { t } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import ToggleItem from './toggle-item';
import WarningItem from './warning-item';

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

    imagePreviewsToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'peerioContentEnabled';
        const title = 'Show previews of image files'; // TODO Peerio Copy
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    largeImagesToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'limitSize';
        const title = 'Show images larger than 3 MB'; // TODO Peerio Copy
        const onPress = () => {
            state.limitSize = !state.limitSize;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    urlPreviewsToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'externalContentEnabled';
        const title = 'Enable all URL Preview'; // TODO Peerio Copy
        const onPress = () => {
            state.externalContentEnabled = !state.externalContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    favoritesToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'externalJustForFavContacts';
        const title = 'Only from Favourites'; // TODO Peerio Copy
        const onPress = () => {
            state.externalJustForFavContacts = !state.externalJustForFavContacts;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    renderThrow() {
        return (
            <View style={bgStyle}>
                <Text style={text}>Image preview</Text>
                {this.imagePreviewsToggle()}
                {this.largeImagesToggle()}
                {<Text style={text}>URL Preview</Text>}
                <WarningItem
                    content="Enabling URL Preview may increase the chance of tracking by third party web services."
                    linkContent="Learn more."
                    link=""
                    />
                {this.urlPreviewsToggle()}
                {User.current.settings.inlineChatContent.externalContentEnabled && this.favoritesToggle()}
                <View style={spacer} />
            </View>
        );
    }
}
