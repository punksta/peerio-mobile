import React from 'react';
import { observable, action, when } from 'mobx';
import { User, chatStore, contactStore, TinyDb } from '../../lib/icebear';
import touchid from '../touchid/touchid-bridge';
import { popupYesCancel } from '../shared/popups';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';

class MainState extends RoutedState {
    @observable _loading = false;

    get loading() {
        return this._loading || chatStore.loading;
    }

    set loading(v) {
        this._loading = v;
    }

    @action async activateAndTransition(user) {
        User.current = user;
        this.routes.app.main();
    }

    @action async load() {
        console.log('main-state.js: loading');
        this.loading = true;
        const s = await TinyDb.user.getValue('main-state');
        if (s) {
            this.saved = s;
        }
        this.loading = false;
        console.log('main-state.js: loaded');
    }

    @action async init() {
        await this.saveUser();
        await this.checkPin();
    }

    @action async checkPin() {
        const user = User.current;
        const hasPin = await user.hasPasscode();
        if (!hasPin) {
            const skipPIN = `${user.username}::skipPIN`;
            if (!await TinyDb.system.getValue(skipPIN)) {
                this.routes.modal.createPin();
                await this.routes.modal.waitFor();
            }
            await TinyDb.system.setValue(skipPIN, true);
        }
    }

    @action async saveUser() {
        const user = User.current;
        await TinyDb.system.setValue('lastUsername', user.username);
        const skipTouchID = `${user.username}::skipTouchID`;
        const skipTouchIDValue = await TinyDb.system.getValue(skipTouchID);
        if (skipTouchIDValue) {
            console.log('main-state.js: skip touch id');
            return;
        }
        await touchid.load();
        if (!touchid.available) {
            console.log('main-state.js: touch id is not available');
            return;
        }
        const touchIdKey = `user::${user.username}::touchid`;
        if (await TinyDb.system.getValue(touchIdKey)) {
            console.log('main-state.js: touch id available and value is set');
            return;
        }
        console.log('main-state.js: touch id available but value is not set');
        console.log('main-state.js: offering to save');
        if (await popupYesCancel(tx('touchId'), tx('setup_touchTitle'))) {
            TinyDb.system.setValue(touchIdKey, true);
            await touchid.save(`user::${user.username}`, user.serializeAuthData());
            console.log('main-state.js: touch id saved');
            return;
        }
        console.log('main-state.js: user cancel touch id');
        await TinyDb.system.setValue(skipTouchID, true);
    }
}

const mainState = new MainState();

// mainState.showPopup({
//     title: tx('passphrase'),
//     text: 'blue zeppelin runs aboard all',
//     buttons: [
//         { id: 'skip', text: tx('button_skip') },
//         { id: 'use', text: tx('button_useQR') }
//     ]
// });

export default mainState;
