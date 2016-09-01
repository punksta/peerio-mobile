import React, { Component } from 'react';
import {
    View
} from 'react-native';
import styles from '../../styles/styles';

export default class Center extends Component {
    render() {
        var style = {
            flexDirection: 'row',
            justifyContent: 'center'
        };
        if(this.props.style)
            style = styles.inherit(style, this.props.style);
        return (
            <View style={style}>
                {this.props.children}
            </View>
        );
    }
}
