import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { vars } from '../../styles/styles';
import { tu } from '../utils/translator';

export default {
    uppercaseBlueButton(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingRight: 12, paddingVertical: 10 }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.bg }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    uppercaseRedButton(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingRight: 12, paddingVertical: 10 }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.txtAlert }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

};
