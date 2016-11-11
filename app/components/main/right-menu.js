import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity, LayoutAnimation
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
        LayoutAnimation.easeInEaseOut();
        mainState.isRightMenuVisible = false;
    }

    componentWillUpdate() {
        if (mainState.isRightMenuVisible) {
            LayoutAnimation.easeInEaseOut();
        }
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
        const ratio = 0.8;
        const width = Dimensions.get('window').width * ratio;
        const containerStyle = {
            position: 'absolute',
            right: mainState.isRightMenuVisible ? 0 : -width,
            left: mainState.isRightMenuVisible ? 0 : undefined,
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
            <Swiper style={containerStyle}
                    onHide={() => (mainState.isRightMenuVisible = false)}
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
