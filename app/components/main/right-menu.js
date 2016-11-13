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
    paddingLeft: 20,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: 'white'
};

const textStyle = {
    color: '#000000CF',
    marginLeft: 4
};

@observer
export default class RightMenu extends Component {

    hideAnimated() {
        mainState.isRightMenuVisible = false;
    }

    item(i, key) {
        return (
            <View style={{ backgroundColor: styles.vars.bg }} key={key}>
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
            top: styles.vars.headerSpacing,
            bottom: 0
        };

        const menuContainerStyle = {
            width,
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF'
        };

        const items = [
            { name: 'Messages', icon: 'message' },
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
