import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars } from '../../styles/styles';
import SafeComponent from '../shared/safe-component';

@observer
export default class SignupGenerationBox extends SafeComponent {
    renderThrow() {
        /* TODO replace with lotti animation? */
        return (
            <View style={{
                height: 38,
                marginBottom: 24,
                borderColor: vars.mediumGrayBg,
                borderWidth: 2,
                borderStyle: 'dotted',
                borderRadius: 6
            }} />
        );
    }
}
