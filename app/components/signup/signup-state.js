import React from 'react';
import { observable, action, computed, autorun } from 'mobx';
import SignupCircles from './signup-circles';
import state from '../layout/state';
import store from '../../store/local-storage';
import touchid from '../touchid/touchid-bridge';
import snackbarState from '../snackbars/snackbar-state';
import { User, PhraseDictionary, validation, socket } from '../../lib/icebear';
import locales from '../../lib/locales';

const { validators, validateField } = validation;

const signupState = observable({
    @validateField(validators.username, 0) username: '',
    @validateField(validators.email, 1) email: '',
    @validateField(validators.firstName, 2) firstName: '',
    @validateField(validators.lastName, 3) lastName: '',
    pin: '',
    pinSaved: false,
    current: 0,
    count: 0,
    @computed get isActive() {
        return state.route.startsWith('signup');
    },

    @computed get nextAvailable() {
        switch (signupState.current) {
            case 0: return this.isValid() && socket.connected;
            case 1: return this.pinSaved && socket.connected;
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
            .then(() => {
                User.current = user;
            })
            .then(state.routes.main.transition)
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

autorun(() => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

