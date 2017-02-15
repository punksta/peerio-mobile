import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import loginState from '../login/login-state';
import settingsState from '../settings/settings-state';
import ghostState from '../ghosts/ghost-state';
import icons from '../helpers/icons';
// import imagePicker from '../helpers/imagepicker';
import { vars } from '../../styles/styles';
import Swiper from '../controls/swiper';
import Hider from '../controls/hider';
import { t } from '../utils/translator';
import { fileStore } from '../../lib/icebear';

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
        mainState.isRightMenuVisible = false;
    }

    item(i, key) {
        const bubble = i.bubble ? icons.bubble(i.bubble) : null;
        const selected = mainState.route === i.route;
        const textStyle = {
            color: selected ? vars.bg : 'rgba(0, 0, 0, .87)',
            fontWeight: selected ? 'bold' : 'normal',
            marginLeft: 20
        };
        return (
            <View style={{ backgroundColor: vars.bg }} key={key}>
                <TouchableOpacity onPress={() => i.action()}>
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

        const items = [
            {
                name: t('messages'),
                route: 'chat',
                bubble: mainState.unreadMessages,
                icon: 'chat-bubble',
                action: () => mainState.messages()
            },
            {
                name: t('files'),
                route: 'files',
                bubble: fileStore.unreadFiles,
                icon: 'folder',
                action: () => mainState.files()
            },
            {
                name: t('ghosts'),
                route: 'ghosts',
                icon: 'mail',
                action: () => ghostState.transition()
            },
            /* {
                name: t('profile'),
                icon: 'person',
                action: () => null
                }, */
            {
                name: t('settings'),
                route: 'settings',
                icon: 'settings',
                action: () => settingsState.transition()
            },
            /*            {
                name: t('upgrade'),
                icon: 'cloud-upload',
                action: () => null
            },
            {
                name: t('help'),
                icon: 'help',
                action: () => null
                }, */
            {
                name: t('Logs'),
                icon: 'help',
                action: () => mainState.logs()
            }
        ];

        const signOut = {
            name: t('signOut'),
            icon: 'power-settings-new',
            action: () => loginState.signOut()
        };

        return (
            <Swiper
                state={mainState}
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
