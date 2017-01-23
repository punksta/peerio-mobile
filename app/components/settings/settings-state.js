import React from 'react';
import { observable, action } from 'mobx';
import mainState from '../main/main-state';
import PinModal from '../controls/pin-modal';
import { User } from '../../lib/icebear';
import { rnAlertYes } from '../../lib/alerts';
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
            rnAlertYes(passphrase);
            mainState.modalControl = null;
        };
        const pinModal = () => (
            <PinModal
                onSuccess={success}
                onCancel={() => (mainState.modalControl = null)} />
        );
        User.current.hasPasscode().then(r => {
            if (!r) {
                rnAlertYes(tx('passcode_notSet'));
                return;
            }
            mainState.modalControl = pinModal;
        });
    }
});

export default settingsState;

