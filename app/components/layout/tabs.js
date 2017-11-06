import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { t } from '../utils/translator';
import { vars } from '../../styles/styles';
import { fileStore, chatStore } from '../../lib/icebear';
import contactState from '../contacts/contact-state';
import routerMain from '../routes/router-main';
import icons from '../helpers/icons';

const actionCellStyle = {
    flex: 1,
    alignItems: 'center',
    height: vars.tabCellHeight,
    justifyContent: 'center'
};

const actionTextStyle = {
    color: vars.white
};

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: vars.tabsBg,
    height: vars.tabsHeight,
    padding: 0,
    paddingBottom: vars.iPhoneXBottom
};

@observer
export default class Tabs extends SafeComponent {

    action(text, route, icon, bubble) {
        const color = routerMain.route === route ? vars.bg : vars.tabsFg;
        const indicator = bubble ? (
            <View style={{ position: 'absolute', right: -5, top: 0 }}>
                {icons.bubble('')}
            </View>
         ) : null;
        return (
            <TouchableOpacity
                onPress={() => routerMain[route]()}
                pressRetentionOffset={vars.retentionOffset}
                style={actionCellStyle}>
                <View pointerEvents="none" style={{ alignItems: 'center' }}>
                    {icons.plain(icon, undefined, color)}
                    <Text style={[actionTextStyle, { color }]}>{text}</Text>
                    {indicator}
                </View>
            </TouchableOpacity>
        );
    }

    renderThrow() {
        if (routerMain.currentIndex !== 0) return null;
        return (
            <View style={bottomRowStyle}>
                {this.action(t('title_chats'), 'chats', 'forum', chatStore.unreadMessages)}
                {this.action(t('title_files'), 'files', 'folder', fileStore.unreadFiles)}
                {this.action(t('title_contacts'),
                    contactState.empty ? 'contactAdd' : 'contacts', 'people')}
                {this.action(t('title_settings'), 'settings', 'settings')}
            </View>
        );
    }
}

Tabs.propTypes = {
    height: PropTypes.any
};
