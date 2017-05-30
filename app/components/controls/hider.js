import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, TouchableOpacity
} from 'react-native';

export default class Hider extends Component {

    render() {
        const spacer = () => <TouchableOpacity onPress={this.props.onHide} style={{ flex: 1 }} />;
        const before = this.props.isLeft ? null : spacer();
        const after = this.props.isLeft ? spacer() : null;

        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {before}
                {this.props.children}
                {after}
            </View>
        );
    }
}

Hider.propTypes = {
    children: PropTypes.any.isRequired,
    isLeft: PropTypes.bool,
    onHide: PropTypes.func.isRequired
};

