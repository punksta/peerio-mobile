import store from '../../store/local-storage';
import state from '../layout/state';
import loginState from '../login/login-state';
import signupState from '../signup/signup-state';
import icebear from '../../lib/icebear';

const bridge = {
    store,
    state,
    loginState,
    signupState,
    icebear
};

global.Peerio = bridge;
