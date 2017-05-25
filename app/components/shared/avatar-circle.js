import React, { Component } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import ErrorCircle from './error-circle';

const avatarDiameter = 36;

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
            backgroundColor: '#CFCFCF',
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
        const inner = contact ? (
            <Text style={{ color: 'white', textAlign: 'center', width: 14 * ratio, fontSize: 12 * ratio }}>
                {letter}
            </Text>
        ) : icons.plainWhite('group');
        return (
            <View style={{ borderWidth: 0, borderColor: 'green' }}>
                <View style={coloredAvatarStyle}>
                    {inner}
                </View>
                <ErrorCircle large={this.props.large} visible={tofuError} />
            </View>
        );
    }
}

AvatarCircle.propTypes = {
    contact: React.PropTypes.any,
    loading: React.PropTypes.bool,
    large: React.PropTypes.bool,
    medium: React.PropTypes.bool
};
