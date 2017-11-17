import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

export default class CircleButtonWithIcon extends Component {
    render() {
        const iconStyle = {
            backgroundColor: this.props.bgColor,
            borderRadius: this.props.radius,
            overflow: 'hidden',
            width: this.props.radius,
            height: this.props.radius,
            marginHorizontal: this.props.margin,
            alignItems: 'center',
            justifyContent: 'center'
        };
        return (
            <TouchableOpacity
                style={iconStyle}
                onPress={this.props.onPress}
                pressRetentionOffset={vars.pressRetentionOffset}>
                {icons.plain(
                    this.props.name,
                    vars.iconSizeSmall,
                    this.props.iconColor)}
            </TouchableOpacity>
        );
    }
}

CircleButtonWithIcon.propTypes = {
    name: PropTypes.any,
    iconColor: PropTypes.any,
    onPress: PropTypes.any,
    iconSize: PropTypes.any,
    radius: PropTypes.any,
    margin: PropTypes.any,
    bgColor: PropTypes.any
};
