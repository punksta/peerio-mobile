import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity, ScrollView
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import messagingState from '../messaging/messaging-state';
import icons from '../helpers/icons';
import styles from '../../styles/styles';
import Swiper from '../controls/swiper';
import Hider from '../controls/hider';
import { chatStore } from '../../lib/icebear';

const circleRadius = 6;
const circleStyle = {
    width: circleRadius,
    height: circleRadius,
    borderRadius: circleRadius / 2,
    backgroundColor: '#7ed321'
};

const circleStyleOff = {
    width: circleRadius,
    height: circleRadius,
    borderRadius: circleRadius / 2,
    borderWidth: 1,
    borderColor: '#00000050',
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
    color: '#000000CF',
    marginLeft: 14
};

const headerTextStyle = {
    color: '#000000CF'
};

const headerContainer = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 20,
    paddingRight: 20
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
                {icons.dark('control-point', () => { this.hideAnimated(); action(); })}
            </View>
        );
    }

    item(i, key) {
        const action = () => messagingState.chat(i);
        const text = i.chatName;
        const online = true;

        return (
            <View style={{ backgroundColor: styles.vars.bg }} key={key}>
                <TouchableOpacity onPress={action}>
                    <View style={itemStyle}>
                        <View style={online ? circleStyle : circleStyleOff} />
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={textStyle}>{text}</Text>
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
            top: styles.vars.headerSpacing,
            bottom: 0,
            right: 0
        };

        const innerContainerStyle = {
            width,
            backgroundColor: 'white',
            borderRightWidth: 1,
            borderRightColor: '#efefef'
        };

        const chats = chatStore.chats;

        return (
            <Swiper
                state={mainState}
                visible="isLeftMenuVisible"
                style={containerStyle}
                width={width}
                {...this.props}
                rightToLeft>
                <Hider onHide={this.hideAnimated} isLeft>
                    <View style={innerContainerStyle}>
                        {/* <View>
                            { this.header('Channels') }
                    </View> */}
                        <View>
                            { this.header('Conversations', () => messagingState.transition()) }
                        </View>
                        <ScrollView>
                            { chats.map(this.item) }
                        </ScrollView>
                    </View>
                </Hider>
            </Swiper>
        );
    }
}

LeftMenu.propTypes = {
};
