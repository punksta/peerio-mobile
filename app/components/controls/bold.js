import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import { vars } from '../../styles/styles';

export default class Bold extends Component {
    render() {
        const style = {
            fontWeight: vars.font.weight.bold
        };
        return (
            <Text style={[style, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

Bold.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
