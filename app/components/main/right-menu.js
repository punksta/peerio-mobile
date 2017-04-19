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
import { PaymentStorageUsage, paymentCheckout } from '../payments/payments-storage-usage';
import { toggleConnection } from './dev-menu-items';

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
                            {i.customRight}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    divider(i, k) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: '#CFCFCF'
        };
        return <View key={k} style={s} />;
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

        const i = (name, route, icon, bubble) => ({ name, route, icon, bubble, map: this.item });
        const i2 = (name, action, icon, customRight) => ({ name, action, icon, customRight, map: this.item });
        const divider = () => ({ map: this.divider });

        let items = [
            // i(t('title_mail'), 'ghosts', 'mail'),
            i(t('title_chats'), 'chats', 'chat-bubble', chatStore.unreadMessages),
            i(t('title_files'), 'files', 'folder', fileStore.unreadFiles),
            divider(),
            i(t('title_settings'), 'settings', 'settings'),
            // i(t('title_help', 'help', 'help')),
            i(t('title_help'), 'logs', 'help'),
            divider(),
            i2(t('Storage usage'), paymentCheckout, 'list', <PaymentStorageUsage />)
        ];

        if (__DEV__) {
            items = items.concat([
                divider(),
                i2('Toggle connection', toggleConnection, 'cast-connected')
            ]);
        }

        const signOut = {
            name: t('button_logout'),
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
                            { items.map((el, k) => el.map(el, k)) }
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
