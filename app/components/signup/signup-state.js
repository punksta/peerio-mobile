import { observable, action, reaction } from 'mobx';
import state from '../layout/state';
import mainState from '../main/main-state';
import { User, PhraseDictionaryCollection, validation, socket } from '../../lib/icebear';

const { validators, addValidation } = validation;

const signupState = observable({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    pin: '',
    pinSaved: false,
    current: 0,
    count: 0,
    inProgress: false,

    get isActive() {
        return state.route.startsWith('signup');
    },

    get nextAvailable() {
        switch (signupState.current) {
            case 0: return this.isValid() && socket.connected;
            case 1: return this.pinSaved && socket.connected;
            default: return false;
        }
    },

    get isLast() {
        return this.current === this.count - 1;
    },

    get isFirst() {
        return this.current === 0;
    },

    transition() {
        state.route = 'signupStep1';
    },

    exit() {
        state.route = 'loginStart';
    },

    reset: action.bound(function() {
        this.current = 0;
    }),

    generatePassphrase() {
        const dict = PhraseDictionaryCollection.current;
        return dict.getPassphrase(5);
    },

    next: action.bound(function() {
        if (!this.nextAvailable) return;
        if (this.current < this.count - 1) {
            signupState.current++;
        } else {
            this.finish();
        }
    }),

    prev: action.bound(function() {
        if (this.current > 0) {
            this.current--;
        } else {
            this.exit();
        }
    }),

    finish: action.bound(async function() {
        this.inProgress = true;
        this.passphrase = await this.generatePassphrase();
        console.log(this.passphrase);
        const user = new User();
        const { username, email, firstName, lastName, pin, passphrase } = this;
        const localeCode = state.locale;

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
    })
});

addValidation(signupState, 'username', validators.username, 0);
addValidation(signupState, 'email', validators.email, 1);
addValidation(signupState, 'firstName', validators.firstName, 2);
addValidation(signupState, 'lastName', validators.lastName, 3);

const signupWizardRoutes = [
    'signupStep1',
    'signupStep2'
];

signupState.count = signupWizardRoutes.length;

// state.persistentFooter.signup = (i) => (signupState.isActive ? <SignupCircles key={i} /> : null);


if (__DEV__) {
    // const s = signupState;
    // s.username = `anritest1`;
    // s.email = `seavan+${new Date().getTime()}@gmail.com`;
    // s.firstName = 's';
    // s.lastName = 's';
}

reaction(() => [signupState.current, signupState.isActive], () => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

