import React from 'react';
import { Text, Clipboard } from 'react-native';
import { observable, action, reaction } from 'mobx';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';
import PinModal from '../controls/pin-modal';
import { User } from '../../lib/icebear';
import { popupCopyCancel, popupYes } from '../shared/popups';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';

class SettingsState {
    @observable subroute = null;
    @observable stack = [];

    get title() {
        const sr = this.subroute;
        return sr ? tx(sr) : tx('settings');
    }

    onTransition(active) {
        if (this.reaction) return;
        this.reaction = reaction(() => routerMain.currentIndex, (i) => {
            if (routerMain.route === 'settings') {
                while (i < this.stack.length) {
                    this.stack.pop();
                }
                this.subroute = i ? this.stack[i - 1] : null;
            }
        });
    }

    @action transition(subroute) {
        console.log(`settings-state.js: transition ${subroute}`);
        routerMain.route = 'settings';
        routerMain.isRightMenuVisible = false;
        routerMain.isLeftHamburgerVisible = false;
        if (subroute) {
            this.subroute = subroute;
            this.stack.push(subroute);
            routerMain.currentIndex = this.stack.length;
        } else {
            routerMain.currentIndex = 0;
            this.stack.clear();
        }
    }

    showPassphrase() {
        const success = passphrase => {
            const mp = (
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                    {passphrase}
                </Text>
            );
            popupCopyCancel(
                tx('passphrase'),
                tx('popup_masterPasswordText'),
                mp
            ).then(r => {
                if (!r) return;
                Clipboard.setString(passphrase);
                snackbarState.pushTemporary(tx('popup_masterPasswordCopied'));
            });
            routerModal.modalControl = null;
        };
        const pinModal = (
            <PinModal
                onSuccess={success}
                onCancel={() => (routerModal.modalControl = null)} />
        );
        User.current.hasPasscode().then(r => {
            if (!r) {
                popupYes(tx('passphrase'), tx('passcode_notSet'));
                return;
            }
            routerModal.modalControl = pinModal;
        });
    }
}

export default new SettingsState();
