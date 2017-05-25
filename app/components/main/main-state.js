import { observable, action } from 'mobx';
import { User, chatStore, TinyDb } from '../../lib/icebear';
import keychain from '../../lib/keychain-bridge';
import { popupYesSkip } from '../shared/popups';
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

    @action async activate(user) {
        User.current = user;
        // preload app while we ask user about automatic login
        this.routerMain.initial();
    }

    @action async activateAndTransition(user) {
        this.activate(user);
        this.routes.app.main();
        await this.saveUser();
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
        // disabling pin for now
        // await this.checkPin();
        // await this.saveUser();
    }

    @action async checkPin() {
        const user = User.current;
        const hasPin = await user.hasPasscode();
        if (!hasPin) {
            const skipPIN = `${user.username}::skipPIN`;
            if (!await TinyDb.system.getValue(skipPIN)) {
                await this.routes.modal.createPin();
            }
            await TinyDb.system.setValue(skipPIN, true);
        }
    }

    @action async saveUserKeychain(secureWithTouchID) {
        const user = User.current;
        await keychain.delete(`user::${user.username}`);
        await keychain.save(`user::${user.username}`, user.serializeAuthData(), secureWithTouchID);
        console.log('main-state.js: keychain saved');
        user.hasTouchIdCached = true;
    }

    @action async damageUserTouchId() {
        const user = User.current;
        await keychain.delete(`user::${user.username}`);
        await keychain.save(`user::${user.username}`, 'blah');
        console.log('main-state.js: touch id damaged');
        user.hasTouchIdCached = true;
    }

    @action async saveUser() {
        const user = User.current;
        console.log(`mainstate.js: ${user.autologinEnabled}`);
        if (!user.autologinEnabled) {
            await keychain.delete(`user::${user.username}`);
            return;
        }
        // user.hasPasscodeCached = await user.hasPasscode();
        await TinyDb.system.setValue('lastUsername', user.username);
        const skipTouchID = `${user.username}::skipTouchID`;
        const skipTouchIDValue = await TinyDb.system.getValue(skipTouchID);
        if (skipTouchIDValue) {
            console.log('main-state.js: skip touch id');
        }
        await keychain.load();
        let secureWithTouchID = false;
        const touchIdKey = `user::${user.username}::touchid`;
        if (await TinyDb.system.getValue(touchIdKey)) {
            console.log('main-state.js: touch id available and value is set');
            user.hasTouchIdCached = true;
            secureWithTouchID = true;
        }
        if (!user.hasTouchIdCached && !skipTouchIDValue && keychain.available) {
            console.log('main-state.js: touch id available but value is not set');
            console.log('main-state.js: offering to save');
            secureWithTouchID = await popupYesSkip(tx('title_touchID'), tx('dialog_enableTouchID'));
            await TinyDb.system.setValue(skipTouchID, true);
            await TinyDb.system.setValue(touchIdKey, secureWithTouchID);
        }
        await this.saveUserKeychain(secureWithTouchID);
    }
}

const mainState = new MainState();

export default mainState;
