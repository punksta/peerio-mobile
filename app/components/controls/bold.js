import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import styles from '../../styles/styles';

export default class Bold extends Component {
    render() {
        let style = {
            fontWeight: 'bold'
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

Bold.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
