import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Clipboard } from 'react-native';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { t, tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import snackbarState from '../snackbars/snackbar-state';
import SignupGenerationBox from './signup-generation-box';
import SignupPdfPreview from './signup-pdf-preview';
import SignupHeading from './signup-heading';

const buttonContainer = {
    alignItems: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupBackupAk extends SafeComponent {
    copyAccountKey() {
        try {
            Clipboard.setString(signupState.passphrase);
            snackbarState.pushTemporary(t('title_copied'));
            signupState.keyBackedUp = true;
        } catch (e) {
            console.error(e);
        }
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <SignupHeading title="title_backupAk" subTitle="title_generatingAkDescription" />
                    <SignupGenerationBox />
                    <View style={buttonContainer}>
                        {buttons.blueTextButton(
                            tx('button_copy'),
                            this.copyAccountKey,
                            null,
                            null,
                            'button_copy')}
                    </View>
                    <Text style={signupStyles.description}>
                        {tx('title_akBackupDescription')}
                    </Text>
                    <View>
                        <SignupPdfPreview />
                    </View>
                    <View style={[buttonContainer, { marginTop: 32 }]}>
                        {buttons.blueTextButton(
                            tx(signupState.keyBackedUp ? 'button_next' : 'button_skipBackup'),
                            signupState.next,
                            null,
                            null,
                            'button_next')}
                    </View>
                </View>
            </View>
        );
    }
}
