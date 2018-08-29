import React from 'react';
import { observer } from 'mobx-react/native';
import { Linking } from 'react-native';
import { action } from 'mobx';
import Text from '../../controls/custom-text';
import SignupTos from '../../signup/signup-tos';
import { tx } from '../../utils/translator';
import vars from '../../../styles/vars';

@observer
export default class SignupTermsOfUseMedcryptor extends SignupTos {
    @action.bound
    readTos() {
        Linking.openURL('https://medcryptor.com/legal/terms-of-use');
    }

    get content() {
        return (
            <Text
                style={{ color: vars.peerioBlue, paddingVertical: vars.spacing.medium.maxi2x }}
                onPress={this.readTos}>
                {tx('title_termsMainPoints')}
            </Text>);
    }
}
