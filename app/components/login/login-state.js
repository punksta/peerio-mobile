import { when, observable, action } from 'mobx';
import RNRestart from 'react-native-restart';
import state from '../layout/state';
import mainState from '../main/main-state';
import { User, validation, fileStore, socket } from '../../lib/icebear';
import touchId from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { tx } from '../utils/translator';

const { validators, addValidation } = validation;
const { isValidLoginUsername } = validators;

const loginState = observable({
    username: '',
    usernameValid: null,
    firstName: '',
    lastName: '',
    passphrase: '',
    passphraseValidationMessage: null,
    changeUser: false,
    savedUserInfo: false,
    isInProgress: false,
    pin: false,
    error: null,

    get isActive() {
        return state.route.startsWith('login');
    },

    get isConnected() {
        return socket.connected;
    },

    clean: action.bound(function() {
        console.log('transitioning to clean');
        this.username = '';
        this.usernameValid = null;
        this.passphrase = '';
        this.savedUserInfo = false;
        this.isInProgress = false;
        this.pin = false;
        state.routes.loginClean.transition();
    }),

    changeUserAction: action.bound(async function() {
        await User.removeLastAuthenticated();
        this.username = null;
        this.usernameValid = null;
        this.passphrase = '';
    }),

    saved: action.bound(function() {
        this.savedUserInfo = true;
        state.routes.loginSaved.transition();
    }),

    _login: action.bound(function(user) {
        console.log(`login-state.js: logging in ${user.username}`);
        return isValidLoginUsername(user.username)
            .then(valid => {
                if (valid) {
                    return user.login();
                }
                // this.error = 'badUsername';
                return Promise.reject(new Error('login-state.js: bad username'));
            })
            .then(() => console.log('login-state.js: logged in'))
            .then(() => mainState.activateAndTransition(user))
            .catch(e => {
                console.error(e);
                // if (!this.error) this.error = 'loginFailed';
                this.passphraseValidationMessage = tx('incorrectPasswordOrPINTitle');
                return Promise.reject(new Error(this.error));
            })
            .finally(() => {
                this.isInProgress = false;
                // setTimeout(() => (this.error = null), 1000);
            });
    }),

    login: action.bound(function(pin) {
        const user = new User();
        user.username = this.username;
        user.passphrase = pin || this.passphrase || 'such a secret passphrase';
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        }).catch(e => console.log(e));
    }),

    loginCached: action.bound(function(data) {
        const user = new User();
        user.deserializeAuthData(data);
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        });
    }),

    async signOut() {
        const inProgress = !!fileStore.files.filter(f => f.downloading || f.uploading).length;
        return (inProgress ? rnAlertYesNo(
            tx('popup_areYouSure'),
            tx('popup_fileTasksNotCompleted')) : Promise.resolve(true)
        )
            .then(() => User.removeLastAuthenticated())
            .then(() => RNRestart.Restart())
            .catch(() => null);
    },

    load: action.bound(async function() {
        console.log(`login-state.js: loading`);
        const userData = await User.getLastAuthenticated();
        if (userData) {
            const { username, firstName, lastName } = userData;
            if (this.username && this.username !== username) return false;
            this.username = username;
            this.username && this.triggerTouchId();
            console.log(`login-state.js: loaded ${userData}`);
            // we logged in with someone else
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            const user = new User();
            user.username = username;
            return user.hasPasscode()
                .then(result => {
                    console.log(`login-state.js: ${result}`);
                    result && this.saved();
                });
        }
        return false;
    }),

    save() {
        return null;
    },

    triggerTouchId: action.bound(async function() {
        await touchId.load();
        touchId.available && touchId.get(`user::${this.username}`)
            .then(data => {
                if (data) {
                    this.loginCached(JSON.parse(data));
                }
            });
    })
});

addValidation(loginState, 'username', validators.usernameLogin, 0);

export default loginState;

this.Peerio = this.Peerio || {};
this.Peerio.loginState = loginState;
