import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
    children: PropTypes.any.isRequired,
    test: PropTypes.any
};
