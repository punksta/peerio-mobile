import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';
import mainState from '../main/main-state';

const avatarRadius = 36;

const avatarStyle = {
    width: avatarRadius,
    height: avatarRadius,
    borderRadius: avatarRadius / 2,
    backgroundColor: '#CFCFCF',
    margin: 4
};

const nameContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
};

const nameMessageContainerStyle = {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 6
};

const nameTextStyle = {
    fontWeight: '500'
};

const lastMessageTextStyle = {
    color: '#000000CC'
};

const dateTextStyle = {
    fontSize: 11,
    color: '#0000009A',
    marginLeft: 6
};

const itemStyle = {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    alignItems: 'flex-start',
    backgroundColor: 'white'
};

@observer
export default class RecentList extends Component {
    item(i, key) {
        const text = i.message.replace(/\s+/g, ' ');
        return (
            <View style={{ backgroundColor: styles.vars.bg }} key={key}>
                <TouchableOpacity>
                    <View key={key} style={itemStyle}>
                        <View style={avatarStyle} />
                        <View style={nameMessageContainerStyle}>
                            <View style={nameContainerStyle}>
                                <Text style={nameTextStyle}>{i.name}</Text>
                                <Text style={dateTextStyle}>{i.date}</Text>
                            </View>
                            <Text style={lastMessageTextStyle}>{text}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const items = mainState.chatItems;
        return (
            <View>
                { items.map(this.item) }
            </View>
        );
    }
}
