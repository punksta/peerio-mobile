import { observable, action, reaction, when } from 'mobx';
import routerApp from '../routes/router-app';
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
    @observable pinSaved = false;
    @observable current = 0;
    @observable count = 0;
    @observable inProgress = false;
    _prefix = 'signup';

    get nextAvailable() {
        switch (this.current) {
            case 0: return this.isValid() && socket.connected;
            case 1: return this.pinSaved && socket.connected;
            default: return false;
        }
    }

    get isLast() {
        return this.current === this.count - 1;
    }

    get isFirst() {
        return this.current === 0;
    }

    transition() {
        routerApp.routes.signupStep1.transition();
    }

    exit() {
        routerApp.routes.loginStart.transition();
    }

    @action reset() {
        this.current = 0;
    }

    generatePassphrase() {
        const dict = PhraseDictionaryCollection.current;
        return dict.getPassphrase(5);
    }

    @action next() {
        if (!this.nextAvailable) return;
        if (this.current < this.count - 1) {
            this.current++;
        } else {
            this.finish();
        }
    }

    @action prev() {
        if (this.current > 0) {
            this.current--;
        } else {
            this.exit();
        }
    }

    @action async finish() {
        this.inProgress = true;
        this.passphrase = await this.generatePassphrase();
        console.log(this.passphrase);
        const user = new User();
        const { username, email, firstName, lastName, pin, passphrase } = this;
        const localeCode = uiState.locale;

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

const signupWizardRoutes = [
    'signupStep1',
    'signupStep2'
];

signupState.count = signupWizardRoutes.length;

if (__DEV__) {
    when(() => signupState.isConnected, () => {
        const s = signupState;
        const rnd = new Date().getTime();
        s.username = `t${rnd}`;
        s.email = `seavan+${rnd}@gmail.com`;
        s.firstName = 'First';
        s.lastName = 'Last';
    });
}

reaction(() => [signupState.current, signupState.isActive], () => {
    if (signupState.isActive) {
        uiState.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

