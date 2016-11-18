import { when, observable, action, reaction } from 'mobx';
import RNRestart from 'react-native-restart';
import state from '../layout/state';
import store from '../../store/local-storage';
import Util from '../helpers/util';
import { User, chatStore, socket } from '../../lib/icebear';
import touchid from '../touchid/touchid-bridge';

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
        return user.login()
            .then(state.routes.main.transition)
            .catch(e => {
                console.error(e);
                this.error = 'loginFailed';
                setTimeout(() => (this.error = null), 1000);
            })
            .finally(() => {
                User.current = user;
                store.openUserDb(user.username);
                this.isInProgress = false;
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

reaction(() => loginState.username, username => {
    // loginState.usernameValid = Util.isValidUsername(username);
});

export default loginState;

this.Peerio = this.Peerio || {};
this.Peerio.loginState = loginState;
