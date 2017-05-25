import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';

const diameter = 18;

export default class ErrorCircle extends SafeComponent {
    renderThrow() {
        if (!this.props.visible) return null;
        const ratio = this.props.large ? 2 : 1;
        const width = diameter * ratio;
        const height = width;
        const color1 = 'red';
        const color2 = 'white';
        const borderColor = this.props.invert ? color1 : color2;
        const backgroundColor = this.props.invert ? color2 : color1;
        const tofuStyle = {
            width,
            height,
            borderRadius: width / 2,
            borderColor,
            borderWidth: 1,
            backgroundColor,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center'
        };
        const containerStyle = {
            position: 'absolute',
            right: 0,
            top: 0,
            padding: 8
        };
        return (
            <TouchableOpacity onPress={this.props.onPress} style={containerStyle}>
                <View style={tofuStyle}>
                    <Text style={{ color: borderColor, fontSize: 12 * ratio, fontWeight: 'bold' }}>!</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

ErrorCircle.propTypes = {
    onPress: React.PropTypes.func,
    visible: React.PropTypes.bool,
    large: React.PropTypes.bool,
    invert: React.PropTypes.bool
};

