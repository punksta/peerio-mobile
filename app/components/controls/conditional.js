import React, { Component } from 'react';
import {
    View
} from 'react-native';
import styles from '../../styles/styles';

export default class Big extends Component {
    render() {
        var children = this.props.children;
        var child = this.props.test ?
            (children[0] ? children[0] : children) : (children.length > 1 ? children[1] : null);
        return (
            child
        );
    }
}
