import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars } from '../../styles/styles';
import SafeComponent from '../shared/safe-component';
import signupState from './signup-state';
import Text from '../controls/custom-text';

const accountKeyStyle = {
    fontSize: vars.font.size.smaller,
    color: '#E90162'
};

const dottedBoxStyle = {
    height: 38,
    marginBottom: 24,
    borderColor: vars.mediumGrayBg,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
};

@observer
export default class SignupGenerationBox extends SafeComponent {
    /* async componentWillMount() {
        signupState.passphrase = await signupState.generatePassphrase();
    } */

    renderThrow() {
        /* TODO replace with lotti animation? */
        return (
            <View style={dottedBoxStyle}>
                <Text style={accountKeyStyle} monospace>{signupState.passphrase}</Text>
            </View>
        );
    }
}
