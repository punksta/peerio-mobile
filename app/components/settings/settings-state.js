import React from 'react';
import { Text, Clipboard, LayoutAnimation } from 'react-native';
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
        return sr ? tx(sr) : tx('title_settings');
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
        LayoutAnimation.easeInEaseOut();
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
        /* if (!passphrase) {
            const hasPasscode = await user.hasPasscode();
            if (!hasPasscode) {
                popupYes(tx('title_MP'), tx('passcode_notSet'));
                return;
            }
            passphrase = await this.routerModal.askPin();
        } */
        if (passphrase) {
            const mp = (
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                    {passphrase}
                </Text>
            );
            popupCopyCancel(
                tx('title_AK'),
                tx('title_AKDetail'),
                mp
            ).then(r => {
                if (!r) return;
                Clipboard.setString(passphrase);
                snackbarState.pushTemporary(tx('title_copied'));
                uiState.debugText = passphrase;
            });
        }
    }
}

export default new SettingsState();
