import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { chatState } from '../states';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import { t } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import Link from '../controls/link';

const container = {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#949494',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingTop: 21,
    paddingBottom: 6,
    marginLeft: 64, // TODO Remove
    marginRight: 16 // TODO Remove
};

const titleContainer = {
    flexDirection: 'row'
};

const titleText = {
    fontSize: 18,
    color: 'black',
    paddingLeft: 8
};

@observer
export default class InlineUrlPreviewConsent extends SafeComponent {
    get spacer() {
        return <View style={{ height: 16 }} />;
    }

    userActionSave() {
        // Get selected index
        // Modify appropriate setting
        // Ex:
        // state.externalJustForFavContacts = true;
        // User.current.saveSettings();
    }

    userActionDismiss() {}

    favoritesToggle() {
        const state = User.current.settings.inlineChatContent;
        const prop = 'externalJustForFavContacts';
        const title = 'Only from Favourites'; // TODO Peerio Copy
        const onPress = () => {
            state.externalJustForFavContacts = !state.externalJustForFavContacts;
            User.current.saveSettings();
        };
    }

    renderThrow() {
        return (
            <View style={container}>
                <View style={titleContainer}>
                    <Icon
                        name="warning"
                        size={vars.iconSize}
                        color="gray"
                    />
                    <Text style={titleText}>
                        {/* TODO Peerio Copy */}
                        Enable URL previews
                    </Text>
                </View>
                {this.spacer}
                <Text>
                    {/* TODO Peerio Copy */}
                    URL previews may increase the chance
                     of being tracked from outside sources.
                     Would you like to enable previews?
                </Text>
                <Link>
                    {/* TODO Peerio Copy */}
                    Learn more
                </Link>
                {this.spacer}
                {/* TODO Radio Buttons */}
            </View>
        );
    }
}
