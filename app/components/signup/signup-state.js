import { observable, action, when } from 'mobx';
import mainState from '../main/main-state';
import uiState from '../layout/ui-state';
import RoutedState from '../routes/routed-state';
import { User, PhraseDictionaryCollection, validation, socket } from '../../lib/icebear';

const { validators, addValidation } = validation;

class SignupState extends RoutedState {
    @observable username = '';
    @observable email = '';
    @observable firstName = '';
    @observable lastName = '';
    @observable pin = '';
    @observable current = 0;
    @observable count = 0;
    @observable inProgress = false;
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

    exit = () => this.routes.app.loginStart();

    @action reset() { this.current = 0; }

    generatePassphrase() {
        const dict = PhraseDictionaryCollection.current;
        return dict.getPassphrase(5);
    }

    @action next() { (this.current < this.count - 1) ? this.current++ : this.finish(); }

    @action prev() { (this.current > 0) ? this.current-- : this.exit(); }

    @action async finish() {
        this.inProgress = true;
        this.passphrase = await this.generatePassphrase();
        console.log(this.passphrase);
        const user = new User();
        const { username, email, firstName, lastName, pin, passphrase } = this;
        const localeCode = uiState.locale;
        console.log(`signup-state.js: ${username}`);
        user.username = username;
        user.email = email;
        user.passphrase = __DEV__ ? 'icebear' : passphrase;
        user.firstName = firstName;
        user.lastName = lastName;
        user.localeCode = localeCode;
        return user.createAccountAndLogin()
            .then(() => mainState.activateAndTransition(user))
            .then(() => User.current.setPasscode(pin))
            .catch((e) => {
                console.log(e);
                this.reset();
            })
            .finally(() => (this.inProgress = false));
    }
}

const signupState = new SignupState();

addValidation(signupState, 'username', validators.username, 0);
addValidation(signupState, 'email', validators.email, 1);
addValidation(signupState, 'firstName', validators.firstName, 2);
addValidation(signupState, 'lastName', validators.lastName, 3);

if (__DEV__) {
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
