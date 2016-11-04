import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import styles from '../../styles/styles';

export default class ErrorText extends Component {
    render() {
        let style = {
            color: '#FF0000B0',
            fontSize: 14,
            height: 14
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

ErrorText.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};

