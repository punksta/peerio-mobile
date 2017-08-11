import { when, observable, action, reaction } from 'mobx';
import RNRestart from 'react-native-restart';
import mainState from '../main/main-state';
import settingsState from '../settings/settings-state';
import { User, validation, fileStore, socket, TinyDb, warnings } from '../../lib/icebear';
import keychain from '../../lib/keychain-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { popupSignOutAutologin } from '../shared/popups';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';

const { validators, addValidation } = validation;

const loginConfiguredKey = 'loginConfigured';

class LoginState extends RoutedState {
    @observable username = '';
    @observable usernameValid = null;
    @observable firstName = '';
    @observable lastName = '';
    @observable passphrase = '';
    @observable passphraseValidationMessage = null;
    @observable changeUser = false;
    @observable current = 0;
    @observable selectedAutomatic = null;
    _prefix = 'login';
    _resetTouchId = null;

    constructor() {
        super();
        reaction(() => this.passphrase, () => (this.passphraseValidationMessage = null));
    }

    @action async enableAutomaticLogin(user) {
        user.autologinEnabled = true;
        const key = `${user.username}::${loginConfiguredKey}`;
        await TinyDb.system.setValue(key, user.autologinEnabled);
    }

    @action changeUserAction() {
        if (this.isInProgress) return;
        this.changeUser = true;
        this.clean();
        this.routes.app.loginStart();
    }

    @action checkSavedUserPin() {
        const user = new User();
        user.username = this.username;
        this.firstName = '';
        this.lastName = '';
        return user.hasPasscode().then(has => has && this.saved());
    }

    @action useMasterPassword() {
        this.current = 2;
        this.routes.app.loginStart();
    }

    @action clean() {
        this.current = 0;
        this.username = '';
        this.passphrase = '';
        this.isInProgress = false;
        this.resetValidationState();
    }

    @action saved = () => {
        this.routes.app.loginSaved();
        if (__DEV__ && process.env.PEERIO_QUICK_PIN) {
            this.login(process.env.PEERIO_QUICK_PIN);
        }
    }

    @action _login(user) {
        console.log(`login-state.js: logging in`);
        User.current = user;
        return user.login()
            .then(() => console.log('login-state.js: logged in'))
            .then(async () => {
                mainState.activate(user);
                if (user.autologinEnabled) return;
                // wait for user to answer
                await this.enableAutomaticLogin(user);
            })
            .catch(e => {
                console.error(e);
                User.current = null;
                this.passphraseValidationMessage = tx('error_wrongAK');
                return Promise.reject(new Error(this.error));
            })
            .then(() => mainState.activateAndTransition(user))
            .then(() => this.clean())
            .then(async () => {
                if (this._resetTouchId) {
                    console.log('login-state.js: fixing touch id');
                    await keychain.delete(`user::${this.username}`);
                    await mainState.saveUserTouchId();
                    this._resetTouchId = false;
                }
            })
            .catch(e => {
                console.error(e);
                if (user.deleted) {
                    console.error('deleted');
                    this.passphraseValidationMessage = tx('title_accountDeleted');
                    warnings.addSevere('title_accountDeleted', 'error_accountSuspendedTitle');
                }
                if (user.blacklisted) {
                    console.error('suspended');
                    this.passphraseValidationMessage = tx('error_accountSuspendedTitle');
                    warnings.addSevere('error_accountSuspendedText', 'error_accountSuspendedTitle');
                }
                return Promise.reject(new Error(this.error));
            })
            .finally(() => {
                this.isInProgress = false;
            });
    }

    @action login = (pin) => {
        const user = new User();
        user.username = this.username;
        user.passphrase = (pin || this.passphrase).trim();
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        }).then(() => mainState.saveUser());
    }

    @action loginCached = (data) => {
        const user = new User();
        user.deserializeAuthData(data);
        this.isInProgress = true;
        user.autologinEnabled = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        });
    }

    async restart() {
        await RNRestart.Restart();
    }

    async signOut() {
        const inProgress = !!fileStore.files.filter(f => f.downloading || f.uploading).length;
        await inProgress ? rnAlertYesNo(tx('dialog_confirmLogOutDuringTransfer')) : Promise.resolve(true);
        if (User.current.autologinEnabled && !await popupSignOutAutologin()) {
            this.routerMain.settings();
            settingsState.transition('security');
            return;
        }
        await User.removeLastAuthenticated();
        const username = User.current.username;
        await TinyDb.system.removeValue(`${username}::${loginConfiguredKey}`);
        await TinyDb.system.removeValue(`user::${username}::touchid`);
        await TinyDb.system.removeValue(`user::${username}::keychain`);
        await TinyDb.system.removeValue(`${username}::skipTouchID`);
        try {
            await keychain.delete(await mainState.getKeychainKey());
        } catch (e) {
            console.log(e);
        }
        await RNRestart.Restart();
    }

    async load() {
        console.log(`login-state.js: loading`);
        try {
            this.isInProgress = true;
            await new Promise(resolve => when(() => socket.connected, resolve));
            this.isInProgress = false;
            const userData = await User.getLastAuthenticated();
            if (!userData) return;
            const { username /* , firstName, lastName */ } = userData;
            if (this.username && this.username !== username) return;
            this.username = username;
            if (username) {
                if (await this.loadFromKeychain()) return;
            }
        } catch (e) {
            console.error(e);
        }
        this.isInProgress = false;
    }

    @action async loadFromKeychain() {
        await keychain.load();
        if (!keychain.hasPlugin) return false;
        const data = await keychain.get(await mainState.getKeychainKey(this.username));
        if (!data) return false;
        return Promise.resolve(data)
            .then(JSON.parse)
            .then(this.loginCached)
            .then(async () => {
                const touchIdKey = `user::${User.current.username}::touchid`;
                User.current.secureWithTouchID = !!await TinyDb.system.getValue(touchIdKey);
                return true;
            })
            .catch(() => {
                console.log('login-state.js: logging in with touch id failed');
                this._resetTouchId = true;
            });
    }
}

const loginState = new LoginState();

addValidation(loginState, 'username', validators.usernameLogin, 0);

export default loginState;
