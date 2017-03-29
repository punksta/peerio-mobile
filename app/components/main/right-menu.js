import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import routerMain from '../routes/router-main';
import loginState from '../login/login-state';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import Swiper from '../controls/swiper';
import Hider from '../controls/hider';
import { fileStore, chatStore } from '../../lib/icebear';
import { t } from '../utils/translator';

const itemStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    backgroundColor: 'white'
};

@observer
export default class RightMenu extends Component {

    hideAnimated() {
        routerMain.isRightMenuVisible = false;
    }

    item(i, key) {
        const bubble = i.bubble ? icons.bubble(i.bubble) : null;
        const selected = routerMain.route === i.route;
        const textStyle = {
            color: selected ? vars.bg : 'rgba(0, 0, 0, .87)',
            fontWeight: selected ? 'bold' : 'normal',
            marginLeft: 20
        };
        const action = () => (i.action ? i.action() : routerMain[i.route]());
        return (
            <View style={{ backgroundColor: vars.bg }} key={key}>
                <TouchableOpacity onPress={action}>
                    <View style={itemStyle} pointerEvents="box-only">
                        { selected ? icons.colored(i.icon, null, vars.bg) : icons.dark(i.icon) }
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={textStyle}>{i.name}</Text>
                            {bubble}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const ratio = vars.menuWidthRatio;
        const width = Dimensions.get('window').width * ratio;
        const containerStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };

        const menuContainerStyle = {
            width,
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            paddingTop: 8
        };

        const shadowStyle = {
            shadowColor: '#000000',
            shadowOpacity: 0.8,
            shadowRadius: 5,
            shadowOffset: {
                height: 3,
                width: 3
            }
        };

        const i = (name, route, icon, bubble) => ({ name, route, icon, bubble });

        const items = [
            // i(t('ghosts'), 'ghosts', 'mail'),
            i(t('messages'), 'chats', 'chat-bubble', chatStore.unreadMessages),
            i(t('files'), 'files', 'folder', fileStore.unreadFiles),
            i(t('settings'), 'settings', 'settings'),
            // i(t('help', 'help', 'help')),
            i(t('logs'), 'logs', 'help')
        ];

        const signOut = {
            name: t('signOut'),
            icon: 'power-settings-new',
            action: () => loginState.signOut()
        };

        return (
            <Swiper
                state={routerMain}
                visible="isRightMenuVisible"
                style={containerStyle}
                leftToRight>
                <Hider onHide={this.hideAnimated}>
                    <View style={[menuContainerStyle, shadowStyle]}>
                        <View>
                            { items.map(this.item) }
                        </View>
                        <View>
                            { this.item(signOut, 0) }
                        </View>
                    </View>
                </Hider>
            </Swiper>
        );
    }
}
