import loginState from '../login/login-state';

const { observable, reaction } = require('mobx');
const { TinyDb, User, warnings, clientApp } = require('../../lib/icebear');

class PreferenceStore {
    // stored with 'pref_' prefix in tinydb
    @observable prefs = {
        doNotDisturbModeEnabled: true,
        allActivityNotifsEnabled: false,
        directNotifsEnabled: true,
        displayMessageContentEnabled: true,
        allActivitySoundsEnabled: false,
        allEmailNotifsEnabled: false,
        newMessageEmailNotifsEnabled: true,
        limitInlineImageSize: false, // will use config.chat.inlineImageSizeLimit
        externalContentConsented: false, // false - no feedback from user yet, true - user expressed their desire
        externalContentEnabled: false,
        externalContentJustForFavs: false,
        peerioContentEnabled: true
    };

    observePreference(key, dbName, localStore) {
        const prefKey = `pref_${key}`;
        TinyDb[dbName].getValue(prefKey)
            .then((loadedValue) => {
                if (loadedValue || loadedValue === false) {
                    localStore[key] = loadedValue;
                }
                reaction(() => localStore[key], () => {
                    TinyDb[dbName].setValue(prefKey, localStore[key]);
                });
            });
    }

    init() {
        Object.keys(this.prefs).forEach((key) => {
            this.observePreference(key, 'user', this.prefs);
        });

        reaction(() => User.current.deleted, loginState.signOut);

        reaction(() => User.current.blacklisted, (blacklisted) => {
            if (blacklisted) {
                warnings.addSevere('error_accountSuspendedText', 'error_accountSuspendedTitle', null, async () => {
                    await loginState.signOut();
                });
            }
        });
    }
}

const preferenceStore = new PreferenceStore();
clientApp.uiUserPrefs = preferenceStore.prefs;

export default preferenceStore;
