import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator
} from 'react-native';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

const avatarDiameter = 36;

const avatarStyle = {
    width: avatarDiameter,
    height: avatarDiameter,
    borderRadius: avatarDiameter / 2,
    backgroundColor: '#CFCFCF',
    margin: 4,
    marginTop: 10
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
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)',
    backgroundColor: 'white',
    paddingLeft: 8
};

const itemContainerStyleNoBorder = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    paddingLeft: 16,
    marginLeft: 6
};

const nameTextStyle = {
    color: 'rgba(0, 0, 0, .54)',
    fontWeight: vars.font.weight.bold,
    fontSize: 14
};

const dateTextStyle = {
    color: 'rgba(0, 0, 0, .38)',
    marginLeft: 8
};

const lastMessageTextStyle = {
    fontWeight: vars.font.weight.regular,
    color: 'rgba(0, 0, 0, .54)',
    fontSize: 14,
    lineHeight: 22
};

const circleDiameter = 6;
const circleStyle = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    backgroundColor: '#7ed321',
    margin: 4
};

const circleStyleOff = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, .54)',
    backgroundColor: 'transparent',
    margin: 4
};

@observer
export default class Avatar extends Component {
    get checked() {
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
        const v = vars;
        const color = this.checked ? v.checkboxActive : v.checkboxInactive;
        const iconColor = this.checked ? 'white' : v.checkboxIconInactive;
        const iconBgColor = 'transparent';
        const icon = this.checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: color,
            padding: 4
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    avatar() {
        const { username, firstName, color } = this.props.contact;
        const letter = (firstName || username || ' ')[0].toUpperCase();
        const coloredAvatarStyle = [avatarStyle, {
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color || '#fff'
        }];
        return (
            <View style={coloredAvatarStyle}>
                <Text style={{ color: 'white' }}>{letter}</Text>
            </View>
        );
    }

    loader() {
        return <ActivityIndicator style={{ height: avatarDiameter, margin: 4 }} />;
    }

    render() {
        const icon = this.props.icon ? icons.dark(this.props.icon) : null;
        const date = this.props.date ? <Text style={dateTextStyle}>{moment(this.props.date).format('LT')}</Text> : null;
        const online = this.props.hideOnline ? null : <View style={this.props.online ? circleStyle : circleStyleOff} />;
        const avatarPlaceholder = this.props.loading ? this.loader() : this.avatar();
        const checkbox = this.props.checkbox ? this.checkbox() : null;
        const ics = this.props.noBorderBottom ? itemContainerStyleNoBorder : itemContainerStyle;
        const message = <Text style={lastMessageTextStyle}>{this.props.message}</Text>;
        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <View style={itemStyle}>
                        {checkbox}
                        <View style={ics}>
                            {avatarPlaceholder}
                            <View style={nameMessageContainerStyle}>
                                <View style={nameContainerStyle}>
                                    <Text ellipsizeMode="tail" style={nameTextStyle}>{this.props.contact.username}</Text>
                                    {date}
                                </View>
                                {message}
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
    contact: React.PropTypes.any.isRequired,
    date: React.PropTypes.any,
    icon: React.PropTypes.string,
    message: React.PropTypes.string,
    online: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    checkbox: React.PropTypes.bool,
    checkedKey: React.PropTypes.string,
    checkedState: React.PropTypes.any,
    hideOnline: React.PropTypes.bool,
    noBorderBottom: React.PropTypes.bool
};

