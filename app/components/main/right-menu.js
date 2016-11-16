import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import icons from '../helpers/icons';
import styles from '../../styles/styles';
import Swiper from '../controls/swiper';
import Hider from '../controls/hider';

const itemStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    backgroundColor: 'white'
};

const textStyle = {
    color: 'rgba(0, 0, 0, .87)',
    marginLeft: 20
};

@observer
export default class RightMenu extends Component {

    hideAnimated() {
        mainState.isRightMenuVisible = false;
    }

    item(i, key) {
        return (
            <View style={{ backgroundColor: styles.vars.bg, height: 48 }} key={key}>
                <TouchableOpacity>
                    <View style={itemStyle}>
                        { icons.dark(i.icon) }
                        <Text style={textStyle}>{i.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const ratio = styles.vars.menuWidthRatio;
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

        const items = [
            { name: 'Messages', icon: 'chat-bubble' },
            { name: 'Files', icon: 'folder' },
            { name: 'Profile', icon: 'person' },
            { name: 'Settings', icon: 'settings' },
            { name: 'Upgrade', icon: 'cloud-upload' },
            { name: 'Help and support', icon: 'help' }
        ];

        const signOut = {
            name: 'Sign out',
            icon: 'power-settings-new'
        };

        return (
            //TODO add overlay when open
            <Swiper
                width={width}
                state={mainState}
                visible="isRightMenuVisible"
                style={containerStyle}
                leftToRight>
                <Hider onHide={this.hideAnimated}>
                    <View style={menuContainerStyle}>
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
