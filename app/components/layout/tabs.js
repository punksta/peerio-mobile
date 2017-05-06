import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';
import { observer } from 'mobx-react/native';
import { t } from '../utils/translator';
import { vars } from '../../styles/styles';
import { fileStore, chatStore } from '../../lib/icebear';
import routerMain from '../routes/router-main';
import icons from '../helpers/icons';

const actionCellStyle = {
    flex: 1,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center'
};

const actionTextStyle = {
    color: vars.white
};

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: vars.tabsBg,
    height: 56,
    padding: 0
};


@observer
export default class Tabs extends Component {

    action(text, route, icon, bubble) {
        const color = routerMain.route === route ? vars.bg : vars.tabsFg;
        const indicator = bubble ? (
            <View style={{ position: 'absolute', right: -10, top: 0 }}>
                {icons.bubble(bubble)}
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

    render() {
        const animation = {
            overflow: 'hidden',
            height: (routerMain.currentIndex === 0) ? 56 : 0
        };
        return (
            <Animated.View style={[bottomRowStyle, animation]}>
                {this.action(t('title_chats'), 'chats', 'forum', chatStore.unreadMessages)}
                {this.action(t('title_files'), 'files', 'folder', fileStore.unreadFiles)}
                {/* this.action(t('title_mail'), 'ghosts', 'mail') */}
                {this.action(t('title_settings'), 'settings', 'settings')}
            </Animated.View>
        );
    }
}

Tabs.propTypes = {
    file: React.PropTypes.any,
    // {Animated.Value} height
    height: React.PropTypes.any
};
