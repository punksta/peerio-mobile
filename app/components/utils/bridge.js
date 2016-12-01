import { t } from 'peerio-translator';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
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
this.Peerio.moment = moment;
