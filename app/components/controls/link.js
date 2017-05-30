import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Text, Linking
} from 'react-native';

export default class Link extends Component {
    constructor(props) {
        super(props);
        this.open = this.open.bind(this);
    }

    open() {
        Linking.openURL(this.props.url);
    }

    render() {
        const style = [{
            textDecorationLine: 'underline'
        }, this.props.style];
        return (
            <Text style={style} onPress={this.open}>
                {this.props.children}
            </Text>
        );
    }
}

Link.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any,
    url: PropTypes.string
};
