import React from 'react';
import { Text, Clipboard } from 'react-native';
import { observable, action, reaction } from 'mobx';
import RoutedState from '../routes/routed-state';
import PinModal from '../controls/pin-modal';
import { User } from '../../lib/icebear';
import { popupCopyCancel, popupYes } from '../shared/popups';
import snackbarState from '../snackbars/snackbar-state';
import uiState from '../layout/ui-state';
import { tx } from '../utils/translator';
import touchId from '../touchid/touchid-bridge';

class SettingsState extends RoutedState {
    @observable subroute = null;
    @observable stack = [];
    _prefix = 'settings';

    get title() {
        const sr = this.subroute;
        return sr ? tx(sr) : tx('settings');
    }

    onTransition(active) {
        this.routerMain.isRightMenuVisible = false;
        this.routerMain.isLeftHamburgerVisible = false;
        if (this.reaction) return;
        this.reaction = reaction(() => this.routerMain.currentIndex, (i) => {
            if (this.routerMain.route === 'settings') {
                while (i < this.stack.length) {
                    this.stack.pop();
                }
                this.subroute = i ? this.stack[i - 1] : null;
            }
        });
    }

    @action transition(subroute) {
        console.log(`settings-state.js: transition ${subroute}`);
        this.routerMain.route = 'settings';
        if (subroute) {
            this.subroute = subroute;
            this.stack.push(subroute);
            this.routerMain.currentIndex = this.stack.length;
        } else {
            this.routerMain.currentIndex = 0;
            this.stack.clear();
        }
    }

    async showPassphrase() {
        const user = User.current;
        let passphrase = null;
        if (touchId.available) {
            const data = await touchId.get(`user::${user.username}`);
            if (data) passphrase = JSON.parse(data).passphrase;
        }
        if (!passphrase) {
            const hasPasscode = await user.hasPasscode();
            if (!hasPasscode) {
                popupYes(tx('passphrase'), tx('passcode_notSet'));
                return;
            }
            passphrase = await this.routerModal.askPin();
        }
        if (passphrase) {
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
                uiState.debugText = passphrase;
                snackbarState.pushTemporary(tx('popup_masterPasswordCopied'));
            });
        }
    }
}

export default new SettingsState();
