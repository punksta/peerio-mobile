import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import icons from '../helpers/icons';
import styles from '../../styles/styles';
import mainState from '../main/main-state';

const avatarRadius = 36;

const avatarStyle = {
    width: avatarRadius,
    height: avatarRadius,
    borderRadius: avatarRadius / 2,
    backgroundColor: '#CFCFCF',
    margin: 4,
    marginTop: 12
};

const circleRadius = 6;
const circleStyle = {
    width: circleRadius,
    height: circleRadius,
    borderRadius: circleRadius / 2,
    backgroundColor: '#7ed321',
    margin: 4
};

const circleStyleOff = {
    width: circleRadius,
    height: circleRadius,
    borderRadius: circleRadius / 2,
    borderWidth: 1,
    borderColor: '#00000050',
    backgroundColor: 'transparent',
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
    fontWeight: '300',
    color: '#000000AA'
};

const itemStyle = {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: 'white'
};

export default class RecentList extends Component {
    press(/* i, key */) {
        console.log('pressing');
        mainState.chat();
    }

    item(i, key) {
        return (
            <View style={{ backgroundColor: styles.vars.bg }} key={key}>
                <TouchableOpacity onPress={() => { mainState.chat(); }}>
                    <View key={key} style={itemStyle}>
                        <View style={avatarStyle} />
                        <View style={nameMessageContainerStyle}>
                            <View style={nameContainerStyle}>
                                <Text style={nameTextStyle}>{i.name}</Text>
                                <View style={i.online ? circleStyle : circleStyleOff} />
                            </View>
                            <Text style={lastMessageTextStyle}>{i.lastMessage}</Text>
                        </View>
                        {icons.dark('navigate-next')}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const items = [
            { name: 'Alice', lastMessage: 'will you go tomorrow to the office?', online: true },
            { name: 'Bob', lastMessage: 'drunken sailor wants me dead', online: true },
            { name: 'Kate', lastMessage: 'call me sometime', online: false },
            { name: 'Sam', lastMessage: 'will you be finishing the fries?', online: false },
            { name: 'Velma', lastMessage: 'where is scooby', online: false },
            { name: 'Vincent', lastMessage: 'are we going to play frisbee?', online: true },
            { name: 'Paul', lastMessage: 'eagle is the vehicle to freedom', online: true },
            { name: 'Anri', lastMessage: 'let them eat cake', online: false },
            { name: 'Flo', lastMessage: 'that is rather unfortunate', online: true },
            { name: 'Samuel', lastMessage: 'we are going to use ansible', online: false },
            { name: 'Eren', lastMessage: 'please specify the steps', online: true },
            { name: 'Skylar', lastMessage: 'i put my hands slowly on the front wheel', online: false },
            { name: 'Slava', lastMessage: 'let us leave it to the gods', online: false }
        ];

        return (
            <View>
                { items.map(this.item) }
            </View>
        );
    }
}
