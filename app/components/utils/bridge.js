import store from '../../store/local-storage';
import state from '../layout/state';
import loginState from '../login/login-state';
import signupState from '../signup/signup-state';

const bridge = {
    store,
    state,
    loginState,
    signupState
};

global.Peerio = bridge;
