import { when, observable, action } from 'mobx';
import RNRestart from 'react-native-restart';
import state from '../layout/state';
import mainState from '../main/main-state';
import store from '../../store/local-storage';
import { User, socket, validation, fileStore } from '../../lib/icebear';
import touchid from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';

const { isValidLoginUsername } = validation.validators;

const loginState = observable({
    username: '',
    usernameValid: null,
    firstName: 'Peerio',
    lastName: 'Test',
    passphrase: '',
    savedPassphrase: '',
    language: 'English',
    changeUser: false,
    savedUserInfo: false,
    isInProgress: false,
    pin: false,
    error: null,

    get isActive() {
        return state.route.startsWith('login');
    },

    get isConnected() {
        return !!socket.connected;
    },

    @action clean() {
        console.log('transitioning to clean');
        this.username = '';
        this.usernameValid = null;
        this.passphrase = '';
        this.savedPassphrase = '';
        this.savedUserInfo = false;
        this.isInProgress = false;
        this.pin = false;
        state.routes.loginClean.transition();
    },

    @action async changeUserAction() {
        await store.system.set('userData', null);
        this.username = null;
        this.usernameValid = null;
        this.passphrase = '';
        this.savedPassphrase = '';
    },

    @action saved() {
        this.savedUserInfo = true;
        state.routes.loginSaved.transition();
    },

    @action _login(user) {
        console.log(`login-state.js: logging in ${user.username}`);
        return isValidLoginUsername(user.username)
            .then(valid => {
                if (valid) {
                    return user.login();
                }
                this.error = 'badUsername';
                return Promise.reject(new Error('Bad username'));
            })
            .then(() => mainState.activateAndTransition(user))
            .catch(e => {
                console.error(e);
                if (!this.error) this.error = 'loginFailed';
                return Promise.reject(new Error(this.error));
            })
            .finally(() => {
                this.isInProgress = false;
                setTimeout(() => (this.error = null), 1000);
            });
    },

    @action login(pin) {
        const user = new User();
        user.username = this.username;
        user.passphrase = pin || this.passphrase || this.savedPassphrase || 'such a secret passphrase';
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        });
    },

    @action async signOut() {
        const inProgress = !!fileStore.files.filter(f => f.downloading || f.uploading).length;
        (inProgress ? rnAlertYesNo('Are you sure?', 'File tasks are not completed') : Promise.resolve(true))
            .then(() => store.system.set('userData', null))
            .then(() => store.system.set('lastUsername', null))
            .then(() => RNRestart.Restart())
            .catch(() => null);
    },

    @action async load() {
        console.log(`login-state.js: loading`);
        const userData = await store.system.get('userData');
        this.username = await store.system.get('lastUsername');
        this.username && this.triggerTouchId();
        if (userData) {
            console.log(`login-state.js: loaded ${userData}`);
            const { username, firstName, lastName } = userData;
            // we logged in with someone else
            if (this.username && this.username !== username) return false;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            store.openUserDb(this.username);
            const user = new User();
            user.username = username;
            return user.hasPasscode()
                .then(result => {
                    console.log(`login-state.js: ${result}`);
                    result && this.saved();
                });
        }
        return false;
    },

    @action async save() {
        const { username, firstName, lastName } = this;
        store.openUserDb(username);
        await store.user.set('userData', {
            username,
            firstName,
            lastName
        });
        await store.user.set('registration', {});
    },

    @action async triggerTouchId() {
        await touchid.load();
        touchid.available && touchid.get(`user::${this.username}`)
            .then(passphrase => {
                if (passphrase) {
                    this.passphrase = passphrase;
                    this.login();
                }
            });
    }
});

// loginState.mount();

export default loginState;

this.Peerio = this.Peerio || {};
this.Peerio.loginState = loginState;
