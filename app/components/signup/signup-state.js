import React from 'react';
import { observable, action, autorun } from 'mobx';
import SignupCircles from './signup-circles';
import state from '../layout/state';
import mainState from '../main/main-state';
import store from '../../store/local-storage';
import touchid from '../touchid/touchid-bridge';
import snackbarState from '../snackbars/snackbar-state';
import { User, PhraseDictionary, validation, socket } from '../../lib/icebear';
import locales from '../../lib/locales';

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

    @action transition() {
        state.route = 'signupStep1';
    },

    @action exit() {
        state.route = 'loginClean';
    },

    @action reset() {
        this.current = 0;
    },

    @action async generatePassphrase() {
        const dictString = await locales.loadDictFile(state.locale);
        const dict = new PhraseDictionary(dictString);
        return dict.getPassphrase(5);
    },

    @action next() {
        if (!this.nextAvailable) return;
        if (this.current < this.count - 1) {
            signupState.current++;
        } else {
            this.finish();
        }
    },

    @action prev() {
        if (this.current > 0) {
            this.current--;
        } else {
            this.exit();
        }
    },

    @action async finish() {
        this.inProgress = true;
        this.passphrase = await this.generatePassphrase();
        console.log(this.passphrase);
        const user = new User();
        const { username, email, firstName, lastName, pin, passphrase } = this;
        const localeCode = state.locale;

        user.username = username;
        user.email = email;
        user.passphrase = passphrase;
        user.firstName = firstName;
        user.lastName = lastName;
        user.localeCode = localeCode;
        return user.createAccountAndLogin()
            .then(() => mainState.activateAndTransition(user))
            .then(() => User.current.setPasscode(pin))
            .then(() => {
                snackbarState.push('Email confirmation has been sent');
            })
            .catch((e) => {
                console.log(e);
                this.reset();
            })
            .then(() => {
                store.openUserDb(username);
                return store.user.set('registration', {
                    username,
                    firstName,
                    lastName,
                    localeCode
                }).then(() => store.system.set('userData', {
                    username,
                    firstName,
                    lastName
                })).then(() => {
                    if (touchid.available) {
                        return touchid.save(`user::${user.username}`, passphrase)
                            .then(() => {
                                store.system.set('userData', {
                                    username,
                                    firstName,
                                    lastName,
                                    touchIdSaved: true
                                });
                            })
                            .catch(e => console.log(e));
                    }
                    return false;
                });
            })
            .finally(() => (this.inProgress = false));
    }
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

state.persistentFooter.signup = (i) => (signupState.isActive ? <SignupCircles key={i} /> : null);


if (__DEV__) {
    // const s = signupState;
    // s.username = `anritest1`;
    // s.email = `seavan+${new Date().getTime()}@gmail.com`;
    // s.firstName = 's';
    // s.lastName = 's';
}

autorun(() => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

