import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { popupYes } from '../shared/popups';
import { tx } from '../utils/translator';

@observer
export default class FileSignatureError extends SafeComponent {
    renderThrow() {
        const container = {
            flexDirection: 'row',
            borderRadius: 8,
            borderColor: vars.txtAlert,
            borderWidth: 1,
            borderLeftWidth: 10,
            backgroundColor: vars.lightGrayBg,
            alignItems: 'center',
            marginVertical: 6,
            paddingVertical: 14,
            paddingHorizontal: vars.spacing.normal
        };

        const text = {
            color: vars.txtAlert,
            marginLeft: 6
        };

        const showAlert = () => popupYes(tx('title_invalidFileSignature'), null, tx('error_invalidFileSignature'));

        return (
            <TouchableOpacity
                onPress={showAlert}
                pressRetentionOffset={vars.pressRetentionOffset}>
                <View style={container}>
                    {icons.plainalert('error-outline')}
                    <Text style={text}>{tx('error_invalidFileSignature')}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
