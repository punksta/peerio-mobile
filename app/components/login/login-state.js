import { observable, action, reaction } from 'mobx';
import state from '../layout/state';
import Util from '../helpers/util';

const loginState = observable({
    username: '',
    usernameValid: null,
    name: 'Peerio Test',
    passphrase: '',
    language: 'English',
    savedUserInfo: true,
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
    }
});

reaction(() => loginState.username, username => {
    loginState.usernameValid = Util.isValidUsername(username);
});

export default loginState;
