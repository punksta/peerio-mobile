import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { observer } from 'mobx-react/native';
import { computed } from 'mobx';
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
    alignItems: 'center',
    backgroundColor: 'white'
};

const itemContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: 'white',
    paddingLeft: 8
};

const nameContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
};

const nameMessageContainerStyle = {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
    marginLeft: 6
};

const nameTextStyle = {
    fontWeight: '500',
    flex: 1
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

@observer
export default class Avatar extends Component {
    @computed get checked() {
        // console.log('avatar.js: computed checked');
        const cs = this.props.checkedState;
        const ck = this.props.checkedKey;
        return cs && ck && !!cs.has(ck);
    }

    hashCode(str) { // java String#hashCode
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB(_i) {
        const i = _i * _i * _i % _i;
        const c = (i & 0x00FFFFFF).toString(16).toUpperCase();
        return '00000'.substring(0, 6 - c.length) + c;
    }

    stringColor(s) {
        return `#${this.intToRGB(this.hashCode(s))}`;
    }

    checkbox() {
        const v = styles.vars;
        const color = this.checked ? v.checkboxActive : v.checkboxInactive;
        const iconColor = this.checked ? 'white' : v.checkboxIconInactive;
        const iconBgColor = this.checked ? v.checkboxActive : v.checkboxInactive;
        const icon = this.checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: color,
            padding: 10
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    render() {
        const icon = this.props.icon ? icons.dark(this.props.icon) : null;
        const date = this.props.date ? <Text style={dateTextStyle}>{this.props.date}</Text> : null;
        const online = this.props.hideOnline ? null : <View style={this.props.online ? circleStyle : circleStyleOff} />;
        const color = this.props.name ? this.stringColor(this.props.name) : 'green';
        const coloredAvatarStyle = [avatarStyle, { backgroundColor: color }];
        const avatar = <View style={coloredAvatarStyle} />;
        const loader = <ActivityIndicator style={{ height: avatarRadius, margin: 4 }} />;
        const avatarPlaceholder = this.props.loading ? loader : avatar;
        const checkbox = this.props.checkbox ? this.checkbox() : null;
        return (
            <View style={{ backgroundColor: styles.vars.bg }}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <View style={itemStyle}>
                        {checkbox}
                        <View style={itemContainerStyle}>
                            {avatarPlaceholder}
                            <View style={nameMessageContainerStyle}>
                                <View style={nameContainerStyle}>
                                    <Text ellipsizeMode="tail" style={nameTextStyle}>{this.props.name}</Text>
                                    {date}
                                </View>
                                <Text style={lastMessageTextStyle}>{this.props.message}</Text>
                            </View>
                            {icon}
                            {online}
                        </View>
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
    loading: React.PropTypes.bool,
    checkbox: React.PropTypes.bool,
    checkedKey: React.PropTypes.string,
    checkedState: React.PropTypes.any,
    hideOnline: React.PropTypes.bool
};

