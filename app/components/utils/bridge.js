import { t } from 'peerio-translator';
import store from '../../store/local-storage';
import state from '../layout/state';
import loginState from '../login/login-state';
import signupState from '../signup/signup-state';

this.Peerio = global.Peerio = global.Peerio || {};
this.Peerio.store = store;
this.Peerio.state = state;
this.Peerio.loginState = loginState;
this.Peerio.signupState = signupState;
this.Peerio.t = t;
