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
    emailValidationMessage: 'email should contain @',
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
            case 0: return this.usernameValid && this.email && this.emailValid;
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
        state.route = 'login';
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
        user.createAccountAndLogin()
            .then(state.routes.main.transition)
            .catch(console.error.bind(console));

        await store.set(`user::${user.username}`, {
            pin,
            username,
            firstName,
            lastName,
            localeCode,
            passphrase
        });
        await store.set('userData', {
            username,
            firstName,
            lastName
        });

        if (touchid.available) {
            setTimeout(() => {
                touchid.save(`user::${user.username}`, passphrase)
                    .then(() => {
                        store.set('userData', {
                            username,
                            firstName,
                            lastName,
                            touchIdSaved: true
                        });
                    })
                    .catch(e => console.log(e));
            }, 5000);
        }
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
});

autorun(() => {
    if (signupState.isActive) {
        state.route = signupWizardRoutes[signupState.current];
    }
});

export default signupState;

