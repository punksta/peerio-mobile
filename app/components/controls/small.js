import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import { vars } from '../../styles/styles';

export default class Small extends Component {
    render() {
        const style = {
            fontSize: vars.font.size.smaller
        };
        return (
            <Text style={[style, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

Small.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
