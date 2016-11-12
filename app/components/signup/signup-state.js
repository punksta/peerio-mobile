import React from 'react';
import { observable, action, computed, autorun, reaction } from 'mobx';
import SignupCircles from './signup-circles';
import state from '../layout/state';
import store from '../../store/local-storage';
import touchid from '../touchid/touchid-bridge';
import Util from '../helpers/util';
import { User, PhraseDictionary } from '../../lib/icebear';
import locales from '../../lib/locales';

const signupState = observable({
    username: '',
    usernameValid: null,
    usernameValidationMessage: '',
    email: '',
    emailValid: null,
    emailValidationMessage: '',
    pin: '',
    pinSaved: false,
    firstName: '',
    lastName: '',
    current: 0,
    count: 0,
    isActive() {
        return state.route.startsWith('signup');
    },

    @computed get nextAvailable() {
        switch (signupState.current) {
            case 0: return this.usernameValid && this.email && this.emailValid && this.firstName && this.lastName;
            case 1: return this.pinSaved;
            default: return false;
        }
    },

    @computed get isLast() {
        return this.current === this.count - 1;
    },

    @computed get isFirst() {
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

    @action async finish() {
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
            .then(state.routes.main.transition)
            .catch((e) => {
                console.log(e);
                if (e && e.code === 406) {
                    this.emailValid = false;
                    this.emailValidationMessage = 'email is taken. try another one';
                }
                this.reset();
            })
            .then(() => {
                store.openUserDb(username);
                return store.user.set('registration', {
                    pin,
                    username,
                    firstName,
                    lastName,
                    localeCode,
                    passphrase
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
            });
    }
});

const signupWizardRoutes = [
    'signupStep1',
    'signupStep2'
];

signupState.count = signupWizardRoutes.length;

state.persistentFooter.signup = (i) => (signupState.isActive ? <SignupCircles key={i} /> : null);

reaction(() => signupState.username, username => {
    signupState.usernameValid = Util.isValidUsername(username);
    if (username.length && !signupState.usernameValid) {
        signupState.usernameValidationMessage = 'username not valid';
    }
    if (username.length && signupState.usernameValid) {
        User.validateUsername(username)
            .then(available => {
                signupState.usernameValid = available;
                if (!available) {
                    signupState.usernameValidationMessage = 'username not available';
                }
            });
    }
});

reaction(() => signupState.email, email => {
    signupState.emailValid = Util.isValidEmail(email);
    if (!signupState.emailValid) {
        signupState.emailValidationMessage = 'email should contain @';
    }
});

autorun(() => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

