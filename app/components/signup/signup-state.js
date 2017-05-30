import { observable, action, when } from 'mobx';
import { mainState, uiState, loginState } from '../states';
import RoutedState from '../routes/routed-state';
import { User, PhraseDictionary, validation, socket } from '../../lib/icebear';

const { validators, addValidation } = validation;

class SignupState extends RoutedState {
    @observable username = '';
    @observable email = '';
    @observable firstName = '';
    @observable lastName = '';
    @observable pin = '';
    @observable _current = 0;
    get current() { return this._current; }
    set current(i) { uiState.hideAll().then(() => (this._current = i)); }
    // two pages of signup wizard
    @observable count = 2;
    _prefix = 'signup';

    get nextAvailable() {
        switch (this.current) {
            // enter profile info
            case 0: return this.isValid() && socket.connected;
            // save pin and register
            case 1: return socket.connected;
            default: return false;
        }
    }

    get isLast() { return this.current === this.count - 1; }

    get isFirst() { return this.current === 0; }

    transition = () => this.routes.app.signupStep1();

    exit = () => {
        this.username = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.pin = '';
        this.current = 0;
        this.resetValidationState();
        this.routes.app.loginStart();
    }

    @action reset() { this.current = 0; }

    generatePassphrase = () => PhraseDictionary.current.getPassphrase(8);

    @action async next() {
        if (!this.isValid()) return;
        if (!this.passphrase) {
            this.passphrase = await this.generatePassphrase();
        }
        /* if (process.env.PEERIO_QUICK_SIGNUP) {
            this.pin = '125125';
            this.finish();
            return;
        } */
        (this.current < this.count - 1) ? this.current++ : this.finish();
    }

    @action prev() { (this.current > 0) ? this.current-- : this.exit(); }

    @action async finish() {
        if (!this.isValid()) return Promise.resolve();
        this.isInProgress = true;
        // this.passphrase = await this.generatePassphrase();
        // console.log(this.passphrase);
        const user = new User();
        const { username, email, firstName, lastName, passphrase } = this;
        const localeCode = uiState.locale;
        console.log(`signup-state.js: ${username}`);
        user.username = username;
        user.email = email;
        user.passphrase = __DEV__ && process.env.PEERIO_QUICK_SIGNUP ? 'icebear' : passphrase;
        user.firstName = firstName;
        user.lastName = lastName;
        user.localeCode = localeCode;
        return user.createAccountAndLogin()
            .then(() => loginState.askAboutAutomaticLogin(user))
            .then(() => mainState.activateAndTransition(user))
            .catch((e) => {
                console.log(e);
                this.reset();
            })
            .finally(() => (this.isInProgress = false));
    }
}

const signupState = new SignupState();

addValidation(signupState, 'username', validators.username, 0);
addValidation(signupState, 'email', validators.email, 1);
addValidation(signupState, 'firstName', validators.firstName, 2);
addValidation(signupState, 'lastName', validators.lastName, 3);

if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
    when(() => !process.env.PEERIO_AUTOLOGIN && signupState.isConnected && signupState.isActive, () => {
        const s = signupState;
        const rnd = new Date().getTime();
        s.username = `t${rnd}`;
        s.email = `seavan+${rnd}@gmail.com`;
        s.firstName = 'First';
        s.lastName = 'Last';
    });
}

export default signupState;
