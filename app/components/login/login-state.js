import { observable, action, reaction } from 'mobx';
import state from '../layout/state';
import store from '../../store/local-storage';
import Util from '../helpers/util';
import { User } from '../../lib/icebear';
import touchid from '../touchid/touchid-bridge';

const loginState = observable({
    username: 'test909090',
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

    @action clean() {
        console.log('transitioning to clean');
        state.routes.loginClean.transition();
    },

    @action saved() {
        state.routes.loginSaved.transition();
    },

    @action login() {
        const user = new User();
        user.username = this.username;
        user.passphrase = this.passphrase || this.savedPassphrase || 'such a secret passphrase';
        this.isInProgress = true;
        user.login()
            .then(state.routes.main.transition)
            .finally(() => {
                this.isInProgress = false;
            });
    },

    @action async load() {
        const userData = await store.get('userData');
        if (userData) {
            const { username, name, touchIdSaved } = userData;
            this.username = username;
            this.name = name;
            this.touchIdSaved = touchIdSaved;
            const userRegData = await store.get(`user::${this.username}`);
            if (userRegData) {
                const { passphrase, pin } = userRegData;
                this.savedPassphrase = passphrase;
                this.pin = pin;
                // this.savedUserInfo = true;
                if (!this.changeUser) {
                    this.saved();
                }
            }
        }
    },

    @action async save() {
        const { username, firstName, lastName } = this;
        await store.set('userData', {
            username,
            firstName,
            lastName
        });
        await store.set(`user::${username}`, {
        });
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
    loginState.usernameValid = Util.isValidUsername(username);
});

export default loginState;

this.Peerio = this.Peerio || {};
this.Peerio.loginState = loginState;
