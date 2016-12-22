import React, { Component } from 'react';
import {
    View
} from 'react-native';

export default class Bottom extends Component {
    render() {
        const style = {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
        };
        return (
            <View style={style}>
                {this.props.children}
            </View>
        );
    }
}

Bottom.propTypes = {
    children: React.PropTypes.any
};
