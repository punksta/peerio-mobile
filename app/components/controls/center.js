import React, { Component } from 'react';
import {
    View
} from 'react-native';
import styles from '../../styles/styles';

export default class Center extends Component {
    render() {
        let style = {
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        };
        if (this.props.style) {
            style = styles.inherit(style, this.props.style);
        }
        return (
            <View style={style}>
                {this.props.children}
            </View>
        );
    }
}

Center.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
