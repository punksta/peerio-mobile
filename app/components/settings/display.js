import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import { chatState } from '../states';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import { t, tx } from '../utils/translator';
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
        const title = tx('title_showImagePreviews');
        const description = tx('title_showImagePreviewsDescription');
        const onPress = () => {
            state.peerioContentEnabled = !state.peerioContentEnabled;
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, description, state, onPress }} />
        );
    }

    largeImagesToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'limitSize';
        const title = tx('title_showLargeImages');
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
        const title = tx('title_enableAllUrlPreview');
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
        const title = tx('title_onlyFromFavourites');
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
                    content={tx('title_EnableUrlPreviewWarning')}
                    linkContent={tx('title_learnMore')}
                    link=""
                    />
                {this.urlPreviewsToggle()}
                {User.current.settings.inlineChatContent.externalContentEnabled && this.favoritesToggle()}
                <View style={spacer} />
            </View>
        );
    }
}
