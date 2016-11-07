import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';

import icons from '../helpers/icons';
import styles from '../../styles/styles';

const avatarRadius = 36;

const avatarStyle = {
    width: avatarRadius,
    height: avatarRadius,
    borderRadius: avatarRadius / 2,
    backgroundColor: '#CFCFCF',
    margin: 4
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

const dateTextStyle = {
    fontSize: 11,
    color: '#0000009A',
    marginLeft: 6
};

const lastMessageTextStyle = {
    fontWeight: '300',
    color: '#000000AA'
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

export default class Avatar extends Component {

    render() {
        const icon = this.props.icon ? icons.dark(this.props.icon) : null;
        const date = this.props.date ? <Text style={dateTextStyle}>{this.props.date}</Text> : null;
        const online = this.props.hideOnline ? null : <View style={this.props.online ? circleStyle : circleStyleOff} />;
        return (
            <View style={{ backgroundColor: styles.vars.bg }}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <View style={itemStyle}>
                        <View style={avatarStyle} />
                        <View style={nameMessageContainerStyle}>
                            <View style={nameContainerStyle}>
                                <Text style={nameTextStyle}>{this.props.name}</Text>
                                {date}
                            </View>
                            <Text style={lastMessageTextStyle}>{this.props.message}</Text>
                        </View>
                        {icon}
                        {online}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

Avatar.propTypes = {
    onPress: React.PropTypes.func,
    name: React.PropTypes.string,
    date: React.PropTypes.string,
    icon: React.PropTypes.string,
    message: React.PropTypes.string,
    online: React.PropTypes.bool,
    hideOnline: React.PropTypes.bool
};

