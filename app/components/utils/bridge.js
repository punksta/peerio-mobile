import { t } from 'peerio-translator';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import { TinyDb } from '../../lib/icebear';
import uiState from '../layout/ui-state';
import loginState from '../login/login-state';
import signupState from '../signup/signup-state';

this.Peerio = global.Peerio = global.Peerio || {};
this.Peerio.store = TinyDb;
this.Peerio.uiState = uiState;
this.Peerio.loginState = loginState;
this.Peerio.signupState = signupState;
this.Peerio.t = t;
this.Peerio.moment = moment;
