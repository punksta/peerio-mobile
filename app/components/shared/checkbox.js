import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
            borderColor: this.props.isChecked ? vars.bg : 'gray',
            backgroundColor: this.props.isChecked ? vars.subtleBg : undefined,
            height: 16,
            width: 16,
            marginHorizontal: 8
        };
        const text = {
            color: this.props.isChecked ? vars.bg : '#000000AA',
            height: 16
        };
        return (
            <TouchableOpacity onPress={() => this.toggle()} pressRetentionOffset={vars.retentionOffset} style={container}>
                <Text style={text}>{this.props.text}</Text>
                <View style={checkbox} />
            </TouchableOpacity>
        );
    }
}

CheckBox.propTypes = {
    text: PropTypes.any,
    isChecked: PropTypes.bool,
    onChange: PropTypes.any
};
