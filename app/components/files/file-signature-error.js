import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { popupYes } from '../shared/popups';

const titleUnverifiedFile = 'Unverified file';
const messageUnverifiedFile =
`There are problems with this file's signature.
It may be forged or damaged. Upload and share file again`;

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
            paddingHorizontal: 8
        };

        const text = {
            color: vars.txtAlert,
            marginLeft: 6
        };

        const showAlert = () => popupYes(titleUnverifiedFile, null, messageUnverifiedFile);

        return (
            <TouchableOpacity
                onPress={showAlert}
                pressRetentionOffset={vars.pressRetentionOffset}>
                <View style={container}>
                    {icons.plainalert('error-outline')}
                    <Text style={text}>{'This file could not be verified'}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
