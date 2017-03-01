import React, { Component } from 'react';
import {
    Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';

@observer
export default class ButtonText extends Component {
    render() {
        const { text, secondary, onPress } = this.props;
        const textStyle = {
            color: secondary ? vars.txtDate : vars.bg,
            fontWeight: 'bold'
        };
        const padding = 24;
        const touchable = {
            padding
        };

        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                style={touchable}
                onPress={onPress}>
                <Text style={textStyle}>
                    {text.toUpperCase ? text.toUpperCase() : text}
                </Text>
            </TouchableOpacity>
        );
    }
}

ButtonText.propTypes = {
    text: React.PropTypes.any,
    onPress: React.PropTypes.any,
    secondary: React.PropTypes.bool
};
