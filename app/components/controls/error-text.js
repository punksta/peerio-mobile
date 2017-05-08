import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import { vars } from '../../styles/styles';

export default class ErrorText extends Component {
    render() {
        const style = {
            color: vars.txtAlert
        };
        return (
            <Text style={[style, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

ErrorText.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};

