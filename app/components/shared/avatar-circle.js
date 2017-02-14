import React, { Component } from 'react';
import {
    Text,
    ActivityIndicator,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';

const avatarDiameter = 36;

@observer
export default class AvatarCircle extends Component {
    render() {
        const ratio = this.props.large ? 3 : 1;
        const width = avatarDiameter * ratio;
        const height = width;
        const avatarStyle = {
            width,
            height,
            borderRadius: width / 2,
            backgroundColor: '#CFCFCF',
            margin: 4,
            marginTop: 10
        };

        if (this.props.loading) {
            return <ActivityIndicator style={{ height, margin: 4 }} />;
        }
        const { username, firstName, color, tofuError } = this.props.contact;
        const bgColor = tofuError ? 'red' : color;
        const letter = tofuError ? '!' : (firstName || username || ' ')[0].toUpperCase();
        const coloredAvatarStyle = [avatarStyle, {
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: bgColor || '#fff'
        }];
        return (
            <View style={coloredAvatarStyle}>
                <Text style={{ color: 'white', fontSize: 12 * ratio }}>{letter}</Text>
            </View>
        );
    }
}

AvatarCircle.propTypes = {
    contact: React.PropTypes.any,
    loading: React.PropTypes.bool,
    large: React.PropTypes.bool
};
