import React, { Component } from 'react';
import {
    View, Dimensions, Text, TouchableOpacity, LayoutAnimation
} from 'react-native';
import { observer } from 'mobx-react/native';
// import { observable } from 'mobx';
import mainState from '../main/main-state';
import icons from '../helpers/icons';
import styles from '../../styles/styles';

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
    constructor(props) {
        super(props);
        this.state = { x: 0, y: 0 };
        this.drag = { x: 0, y: 0 };
        this.setPosition = this.setPosition.bind(this);
        this.resetPosition = this.resetPosition.bind(this);
        this._onStartShouldSetResponder = this._onStartShouldSetResponder.bind(this);
        this._onMoveShouldSetResponder = this._onMoveShouldSetResponder.bind(this);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
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

    setPosition(e) {
        this.setState({
            x: this.state.x + (e.nativeEvent.pageX - this.drag.x),
            y: this.state.y + (e.nativeEvent.pageY - this.drag.y)
        });
        this.drag.x = e.nativeEvent.pageX;
        this.drag.y = e.nativeEvent.pageY;
        console.log(this.drag);
    }

    resetPosition(/* e */) {
        LayoutAnimation.easeInEaseOut();
        this.dragging = false;
        this.setState({
            x: 0,
            y: 0
        });
    }

    _onStartShouldSetResponder(e) {
        this.dragging = true;
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
        return true;
    }

    _onMoveShouldSetResponder(/* e */) {
        return true;
    }

    getCardStyle() {
        const transform = [{ translateX: this.state.x }];
        return { transform };
    }

    render() {
        const ratio = 0.8;
        const width = Dimensions.get('window').width * ratio;
        const containerStyle = {
            position: 'absolute',
            paddingTop: 30,
            left: (mainState.isLeftMenuVisible ? 0 : -width),
            top: 0,
            bottom: 0,
            width,
            backgroundColor: '#FFFFFF'
        };

        const testItems = [
            { name: 'Alice', id: '1', online: true },
            { name: 'Albert', id: '2', online: false },
            { name: 'Jennifer', id: '3', online: false },
            { name: 'Sam', id: '4', online: true },
            { name: 'Willie', id: '5', online: true }
        ];

        const s = this.getCardStyle();

        return (
            <View
                onResponderMove={this.setPosition}
                onResponderRelease={this.resetPosition}
                onStartShouldSetResponder={this._onStartShouldSetResponder}
                onMoveShouldSetResponder={this._onMoveShouldSetResponder}
                style={[containerStyle, s]}>
                <View>
                    { this.header('Channels') }
                </View>
                <View>
                    { this.header('Conversations') }
                    { testItems.map(this.item) }
                </View>
            </View>
        );
    }
}

LeftMenu.propTypes = {
};
