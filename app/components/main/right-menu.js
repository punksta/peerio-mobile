import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity, LayoutAnimation
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import icons from '../helpers/icons';
import styles from '../../styles/styles';

const itemStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: 'white'
};

const textStyle = {
    color: '#000000CF',
    marginLeft: 14
};

@observer
export default class RightMenu extends Component {

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
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
            paddingTop: 30,
            right: mainState.isRightMenuVisible ? 0 : -width,
            top: 0,
            bottom: 0,
            width,
            backgroundColor: '#FFFFFF',
            flex: 1,
            justifyContent: 'space-between'
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
            <View style={containerStyle}>
                <View>
                    { items.map(this.item) }
                </View>
                <View>
                    { this.item(signOut, 0) }
                </View>
            </View>
        );
    }
}
