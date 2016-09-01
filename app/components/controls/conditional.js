import React, { Component } from 'react';
import {
    View
} from 'react-native';
import styles from '../../styles/styles';

export default class Conditional extends Component {
    render() {
        const children = this.props.children;
        let child = null;
        if (this.props.test) {
            child = (children[0] ? children[0] : children);
        } else {
            child = children.length > 1 ? children[1] : null;
        }
        return (
            child
        );
    }
}

Conditional.propTypes = {
    children: React.PropTypes.any.isRequired,
    test: React.PropTypes.any
};
