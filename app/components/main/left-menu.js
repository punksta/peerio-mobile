import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity, LayoutAnimation
} from 'react-native';
import { observer } from 'mobx-react/native';
// import { observable } from 'mobx';
import mainState from '../main/main-state';
import icons from '../helpers/icons';
import styles from '../../styles/styles';
import Swiper from '../controls/swiper';
import Hider from '../controls/hider';

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
        LayoutAnimation.easeInEaseOut();
        mainState.isLeftMenuVisible = false;
    }

    componentWillUpdate() {
        if (mainState.isLeftMenuVisible) {
            LayoutAnimation.easeInEaseOut();
        }
    }

    channel(i) {
        return (
            <View style={itemStyle} key={i.id}>
                <View style={i.online ? circleStyle : circleStyleOff} />
                <Text style={textStyle}>{i.name}</Text>
            </View>
        );
    }

    header(i) {
        return (
            <View style={headerContainer}>
                <View>
                    <Text style={headerTextStyle}>
                        {i}
                    </Text>
                </View>
                {icons.dark('control-point')}
            </View>
        );
    }

    item(i) {
        return (
            <View style={{ backgroundColor: styles.vars.bg }} key={i.id}>
                <TouchableOpacity>
                    <View style={itemStyle}>
                        <View style={i.online ? circleStyle : circleStyleOff} />
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
            left: (mainState.isLeftMenuVisible ? 0 : -width),
            top: styles.vars.headerSpacing,
            bottom: 0,
            right: (mainState.isLeftMenuVisible ? 0 : undefined)
        };

        const testItems = [
            { name: 'Alice', id: '1', online: true },
            { name: 'Albert', id: '2', online: false },
            { name: 'Jennifer', id: '3', online: false },
            { name: 'Sam', id: '4', online: true },
            { name: 'Willie', id: '5', online: true }
        ];

        return (
            <Swiper style={containerStyle}
                    onHide={() => (mainState.isLeftMenuVisible = false)}
                    rightToLeft>
                <Hider onHide={this.hideAnimated} isLeft>
                    <View style={{ width, backgroundColor: 'white' }}>
                        <View>
                            { this.header('Channels') }
                        </View>
                        <View>
                            { this.header('Conversations') }
                            { testItems.map(this.item) }
                        </View>
                    </View>
                </Hider>
            </Swiper>
        );
    }
}

LeftMenu.propTypes = {
};
