import { observable, action, reaction } from 'mobx';
import state from '../layout/state';
import store from '../../store/local-storage';
import Util from '../helpers/util';

const loginState = observable({
    username: '',
    usernameValid: null,
    name: 'Peerio Test',
    passphrase: '',
    language: 'English',
    savedUserInfo: false,
    pin: false,

    @action clean() {
        console.log('transitioning to clean');
        state.routes.loginClean.transition();
    },

    @action saved() {
        state.routes.loginSaved.transition();
    },

    @action login() {
        state.routes.main.transition();
    },

    @action async load() {
        const userData = await store.get('userData');
        if (userData) {
            loginState.username = userData.username;
            loginState.name = userData.name;
            loginState.savedUserInfo = true;
        }
    },

    @action async save() {
        const { username, name } = this;
        await store.set('userData', {
            username,
            name
        });
    }
});

reaction(() => loginState.username, username => {
    loginState.usernameValid = Util.isValidUsername(username);
});

export default loginState;

this.Peerio = this.Peerio || {};
this.Peerio.loginState = loginState;
