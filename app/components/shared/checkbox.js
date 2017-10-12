import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';


@observer
export default class CheckBox extends Component {
    toggle() {
        this.props.isChecked = !this.props.isChecked;
        this.props.onChange && this.props.onChange(this.props.isChecked);
    }

    render() {
        const { isChecked } = this.props;
        const borderColor = isChecked ? vars.bg : 'gray';
        const backgroundColor = isChecked ? vars.subtleBg : undefined;
        const container = {
            flexDirection: 'row',
            flexGrow: 1,
            flex: 1,
            justifyContent: 'flex-end',
            paddingVertical: 16
        };
        const checkbox = {
            borderRadius: 2,
            borderWidth: 2,
            borderColor,
            backgroundColor,
            height: 16,
            width: 16,
            marginHorizontal: vars.spacing.normal
        };
        const text = {
            color: '#000000AA',
            height: 16
        };
        return (
            <TouchableOpacity onPress={() => this.toggle()} pressRetentionOffset={vars.retentionOffset} style={container}>
                <Text style={text}>{this.props.text}</Text>
                <View style={checkbox}>
                    {this.props.isChecked && <Icon name="check" color={borderColor} />}
                </View>
            </TouchableOpacity>
        );
    }
}

CheckBox.propTypes = {
    text: PropTypes.any,
    isChecked: PropTypes.bool,
    onChange: PropTypes.any
};
