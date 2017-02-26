import React from 'react';
import { Text, Clipboard } from 'react-native';
import { observable, action } from 'mobx';
import mainState from '../main/main-state';
import PinModal from '../controls/pin-modal';
import { User } from '../../lib/icebear';
import { popupCopyCancel, popupYes } from '../shared/popups';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';


const settingsState = observable({
    subroute: null,

    transition: action.bound(function(subroute) {
        console.log(`settings-state.js: transition ${subroute}`);
        mainState.route = 'settings';
        mainState.isRightMenuVisible = false;
        mainState.isLeftHamburgerVisible = false;
        if (subroute) {
            this.subroute = subroute;
            mainState.isBackVisible = true;
            mainState.currentIndex = 1;
        } else {
            mainState.isBackVisible = false;
            mainState.currentIndex = 0;
        }
    }),

    showPassphrase() {
        const success = passphrase => {
            const mp = (
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                    {passphrase}
                </Text>
            );
            popupCopyCancel(
                tx('passphrase'),
                'This is your master password. Use it to login to another device.',
                mp
            ).then(r => {
                if (!r) return;
                Clipboard.setString(passphrase);
                snackbarState.pushTemporary('Master Password has been copied to clipboard');
            });
            mainState.modalControl = null;
        };
        const pinModal = () => (
            <PinModal
                onSuccess={success}
                onCancel={() => (mainState.modalControl = null)} />
        );
        User.current.hasPasscode().then(r => {
            if (!r) {
                popupYes(tx('passphrase'), tx('passcode_notSet'));
                return;
            }
            mainState.modalControl = pinModal;
        });
    }
});

mainState.titles.settings = (/* s */) => {
    const sr = settingsState.subroute;
    return sr ? tx(sr) : tx('settings');
};

export default settingsState;
