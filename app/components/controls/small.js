import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import styles from '../../styles/styles';

export default class Small extends Component {
    render() {
        var style = {
            fontSize: styles.vars.font.size.smaller
        };
        if(this.props.style)
            style = styles.inherit(style, this.props.style);
        return (
            <Text style={style}>
                {this.props.children}
            </Text>
        );
    }
}
