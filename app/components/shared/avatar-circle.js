import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, ActivityIndicator, View, Image } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import ErrorCircle from './error-circle';

const avatarDiameter = 36;

@observer
export default class AvatarCircle extends SafeComponent {
    renderThrow() {
        const { large, medium, contact, loading } = this.props;
        let ratio = 1;
        if (large) ratio = 3;
        if (medium) ratio = 2;
        const width = avatarDiameter * ratio;
        const height = width;
        const avatarStyle = {
            width,
            height,
            borderRadius: width / 2,
            margin: 4 * ratio
        };
        if (loading) {
            return <ActivityIndicator style={{ height, margin: 4 }} />;
        }

        const { color, tofuError, letter } = contact || {};
        const coloredAvatarStyle = [avatarStyle, {
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color || 'gray'
        }];
        let inner = <View style={coloredAvatarStyle}>{icons.plainWhite('group')}</View>;
        if (contact) {
            if (contact.hasAvatar) {
                const uri = (large || medium) ? contact.largeAvatarUrl : contact.mediumAvatarUrl;
                inner = <Image source={{ uri, cache: 'force-cache' }} key={uri} style={avatarStyle} />;
            } else {
                inner = (
                    <View style={coloredAvatarStyle}>
                        <Text style={{ color: 'white', textAlign: 'center', width: 14 * ratio, fontSize: 12 * ratio }}>
                            {letter}
                        </Text>
                    </View>
                );
            }
        }

        return (
            <View style={{ borderWidth: 0, borderColor: 'green' }}>
                {inner}
                <ErrorCircle large={this.props.large} visible={tofuError} />
            </View>
        );
    }
}

AvatarCircle.propTypes = {
    contact: PropTypes.any,
    loading: PropTypes.bool,
    large: PropTypes.bool,
    medium: PropTypes.bool
};
