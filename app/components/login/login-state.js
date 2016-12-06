import { when, observable, action, computed } from 'mobx';
import RNRestart from 'react-native-restart';
import state from '../layout/state';
import store from '../../store/local-storage';
import { User, chatStore, socket, validation } from '../../lib/icebear';
import touchid from '../touchid/touchid-bridge';

const { isValidLoginUsername } = validation.validators;

const loginState = observable({
    username: '',
    usernameValid: null,
    firstName: 'Peerio',
    lastName: 'Test',
    touchIdSaved: false,
    passphrase: '',
    savedPassphrase: '',
    language: 'English',
    changeUser: false,
    savedUserInfo: false,
    isInProgress: false,
    pin: false,
    error: null,

    @computed get isActive() {
        return state.route.startsWith('login');
    },

    @computed get isConnected() {
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
        state.routes.loginSaved.transition();
    },

    @action _login(user) {
        return isValidLoginUsername(user.username)
            .then(valid => {
                if (valid) {
                    return user.login();
                }
                this.error = 'badUsername';
                return Promise.reject(new Error('Bad username'));
            })
            .then(state.routes.main.transition)
            .then(() => {
                User.current = user;
                store.openUserDb(user.username);
                chatStore.loadAllChats();
                when(() => !chatStore.loading, () => {
                    console.log('when loaded');
                    console.log(chatStore.chats.length);
                    // chatStore.chats.forEach(c => {
                        // console.log(c);
                        // console.log(c.participants);
                    // });
                });
                return null;
            })
            .catch(e => {
                console.error(e);
                if (!this.error) this.error = 'loginFailed';
            })
            .finally(() => {
                this.isInProgress = false;
                setTimeout(() => (this.error = null), 1000);
            });
    },

    @action login() {
        const user = new User();
        user.username = this.username;
        user.passphrase = this.passphrase || this.savedPassphrase || 'such a secret passphrase';
        this.isInProgress = true;
        when(() => socket.connected, () => this._login(user));
    },

    @action async signOut() {
        await store.user.set('userData', null);
        RNRestart.Restart();
    },

    @action async load() {
        const userData = await store.system.get('userData');
        if (userData) {
            const { username, firstName, lastName, touchIdSaved } = userData;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.touchIdSaved = touchIdSaved;
            store.openUserDb(this.username);
            const userRegData = await store.user.get('registration');
            if (userRegData) {
                const { passphrase, pin } = userRegData;
                this.savedPassphrase = passphrase;
                this.pin = pin;
                this.savedUserInfo = true;
                this.saved();
            }
        }
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
                this.passphrase = passphrase;
                this.login();
            });
    }
});

// loginState.mount();

export default loginState;

this.Peerio = this.Peerio || {};
this.Peerio.loginState = loginState;
