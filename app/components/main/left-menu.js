import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity, ScrollView
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import messagingState from '../messaging/messaging-state';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import Swiper from '../controls/swiper';
import { chatStore } from '../../lib/icebear';

const circleDiameter = 8;
const circleStyle = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    backgroundColor: '#7ed321'
};

const circleStyleOff = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .54)',
    backgroundColor: 'transparent'
};

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
    flex: 1,
    color: 'rgba(0, 0, 0, .87)',
    marginLeft: 14,
    paddingRight: 12
};

const headerTextStyle = {
    color: 'rgba(0, 0, 0, .54)',
    fontWeight: vars.font.weight.semiBold
};

const headerContainer = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 16
};

@observer
export default class LeftMenu extends Component {

    hideAnimated() {
        mainState.isLeftMenuVisible = false;
    }

    channel(i) {
        return (
            <View style={itemStyle} key={i.id}>
                <View style={i.online ? circleStyle : circleStyleOff} />
                <Text style={textStyle}>{i.name}</Text>
            </View>
        );
    }

    header(i, action) {
        return (
            <View style={headerContainer}>
                <View>
                    <Text style={headerTextStyle}>
                        {i}
                    </Text>
                </View>
                {icons.dark('add-circle-outline', () => { action(); })}
            </View>
        );
    }

    item(i, key) {
        const action = () => messagingState.chat(i);
        const text = i.chatName;
        const online = true;
        const unread = i.unreadCount;
        const unreadText = unread ? icons.bubble(unread) : null;

        return (
            <View style={{ backgroundColor: vars.bg }} key={key}>
                <TouchableOpacity onPress={action}>
                    <View style={itemStyle}>
                        <View style={online ? circleStyle : circleStyleOff} />
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={textStyle}>{text}</Text>{unreadText}
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
            top: 0,
            bottom: 0,
            width
        };

        const innerContainerStyle = {
            backgroundColor: 'white',
            borderRightWidth: 1,
            borderRightColor: 'rgba(0,0,0,.12)'
        };

        const chats = chatStore.chats;

        return (
            <Swiper
                state={mainState}
                width="animatedLeftMenuWidth"
                animated="animatedLeftMenu"
                visible="isLeftMenuVisible"
                threshold={0.5}
                style={containerStyle}
                {...this.props}
                rightToLeft>
                <View style={innerContainerStyle}>
                    <View>
                        { this.header('Conversations', () => messagingState.transition()) }
                    </View>
                    <ScrollView>
                        { chats.map(this.item) }
                    </ScrollView>
                </View>
            </Swiper>
        );
    }
}

LeftMenu.propTypes = {
};
