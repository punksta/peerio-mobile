import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';

@observer
export default class AccountUpgradeToggle extends Component {
    render() {
        const { highlight, left, text1, text2 } = this.props;
        const toggleContainer = {
            backgroundColor: highlight ? 'white' : 'transparent',
            borderWidth: 2,
            borderColor: 'white',
            flex: 1,
            flexGrow: 1,
            padding: 4,
            alignItems: 'center',
            marginRight: left ? 18 : 0
        };
        const textStyle = {
            color: highlight ? 'black' : 'white'
        };

        const text1Style = [textStyle, {
            fontWeight: 'bold',
            fontSize: 16
        }];

        const text2Style = [textStyle, {
            opacity: 0.7
        }];

        return (
            <TouchableOpacity pressRetentionOffest={vars.pressRetentionOffest} style={toggleContainer}>
                <Text style={text1Style}>{text1}</Text>
                <Text style={text2Style}>{text2}</Text>
            </TouchableOpacity>
        );
    }
}

AccountUpgradeToggle.propTypes = {
    highlight: PropTypes.bool,
    left: PropTypes.bool,
    text1: PropTypes.string,
    text2: PropTypes.string
};
