import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import styles, { vars } from '../../styles/styles';

export default class Italic extends Component {
    render() {
        let style = {
            fontStyle: 'italic'
        };
        if (this.props.style) {
            style = styles.inherit(style, this.props.style);
        }
        return (
            <Text style={style}>
                {this.props.children}
            </Text>
        );
    }
}

Italic.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
