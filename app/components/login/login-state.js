import { observable, action } from 'mobx';
import state from '../layout/state';

const loginState = observable({
    username: '',
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

export default loginState;
