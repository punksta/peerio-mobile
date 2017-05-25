import React, { Component } from 'react';
import {
    Text
} from 'react-native';

export default class Italic extends Component {
    render() {
        const style = {
            fontStyle: 'italic'
        };
        return (
            <Text style={[style, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

Italic.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
