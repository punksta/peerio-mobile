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

const buttonContainer = {
    alignItems: 'flex-end',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi2x
};

@observer
export default class SignupBackupAk extends SafeComponent {
    copyAccountKey() {
        // TODO set signupState flag for drawer to not show in next step
        Clipboard.setString(signupState.passphrase);
        snackbarState.pushTemporary(t('title_copied'));
        signupState.next();
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <View style={signupStyles.container2}>
                    <Text semibold style={signupStyles.headerStyle2}>
                        {tx('title_backupAk')}
                    </Text>
                    <Text style={signupStyles.headerDescription2}>
                        {tx('title_backupAkDescription')}
                    </Text>
                    {/* TODO replace with account key */}
                    <View style={{ height: 38, borderColor: 'red', borderWidth: 1 }} />
                    <View style={buttonContainer}>
                        {buttons.roundBlueBgButton(
                            tx('button_copy'),
                            this.copyAccountKey,
                            null,
                            'button_copy')}
                    </View>
                    <Text style={signupStyles.description}>
                        {tx('title_copyAkTip')}
                    </Text>
                    <Text style={signupStyles.description}>
                        {tx('title_copyAkTip2')}
                    </Text>
                </View>
                <View style={{ position: 'absolute', bottom: 56, right: 20 }}>
                    {buttons.blueTextButton(
                        tx('button_skipBackup'),
                        signupState.next,
                        null,
                        null,
                        'button_skipBackup')}
                </View>
            </View>
        );
    }
}
