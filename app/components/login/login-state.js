import { when, observable, action, reaction } from 'mobx';
import RNRestart from 'react-native-restart';
import mainState from '../main/main-state';
import { User, validation, fileStore, socket } from '../../lib/icebear';
import touchId from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';

const { validators, addValidation } = validation;

class LoginState extends RoutedState {
    @observable username = '';
    @observable usernameValid = null;
    @observable firstName = '';
    @observable lastName = '';
    @observable passphrase = '';
    @observable passphraseValidationMessage = null;
    @observable changeUser = false;
    @observable current = 0;
    _prefix = 'login';
    _resetTouchId = null;

    constructor() {
        super();
        reaction(() => this.passphrase, () => (this.passphraseValidationMessage = null));
    }

    @action changeUserAction() {
        if (this.isInProgress) return;
        this.changeUser = true;
        this.clean();
        this.routes.app.loginStart();
    }

    @action checkSavedUserPin() {
        const user = new User();
        user.username = this.username;
        this.firstName = '';
        this.lastName = '';
        return user.hasPasscode().then(has => has && this.saved());
    }

    @action useMasterPassword() {
        this.current = 2;
        this.routes.app.loginStart();
    }

    @action clean() {
        this.current = 0;
        this.username = '';
        this.passphrase = '';
        this.isInProgress = false;
        this.resetValidationState();
    }

    @action saved = () => {
        this.routes.app.loginSaved();
        if (__DEV__ && process.env.PEERIO_QUICK_PIN) {
            this.login(process.env.PEERIO_QUICK_PIN);
        }
    }

    @action _login(user) {
        console.log(`login-state.js: logging in ${user.username}`);
        return user.login()
            .then(() => console.log('login-state.js: logged in'))
            .then(() => mainState.activateAndTransition(user))
            .then(() => this.clean())
            .then(async () => {
                if (this._resetTouchId) {
                    console.log('login-state.js: fixing touch id');
                    await touchId.delete(`user::${this.username}`);
                    await mainState.saveUserTouchId();
                    this._resetTouchId = false;
                }
            })
            .catch(e => {
                console.error(e);
                this.passphraseValidationMessage = tx('error_wrongPassword');
                return Promise.reject(new Error(this.error));
            })
            .finally(() => {
                this.isInProgress = false;
            });
    }

    @action login = (pin) => {
        const user = new User();
        user.username = this.username;
        user.passphrase = pin || this.passphrase || 'such a secret passphrase';
        this.isInProgress = true;
        console.log(this.username);
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        });
    }

    @action loginCached = (data) => {
        const user = new User();
        user.deserializeAuthData(data);
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        });
    }

    async signOut() {
        const inProgress = !!fileStore.files.filter(f => f.downloading || f.uploading).length;
        return (inProgress ? rnAlertYesNo(
            tx('dialog_confirmLogOutDuringTransfer')) : Promise.resolve(true)
        )
            .then(() => User.removeLastAuthenticated())
            .then(() => RNRestart.Restart())
            .catch(() => null);
    }

    async load() {
        console.log(`login-state.js: loading`);
        const userData = await User.getLastAuthenticated();
        if (!userData) return;
        const { username, firstName, lastName } = userData;
        if (this.username && this.username !== username) return;
        this.username = username;
        if (username) {
            this.isInProgress = true;
            if (await this.triggerTouchId()) return;
            this.isInProgress = false;
        }
        console.log(`login-state.js: loaded`);
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.current = 2;
        // disabling PIN for now
        // const user = new User();
        // user.username = username;
        // if (await user.hasPasscode()) this.saved();
    }

    @action async triggerTouchId() {
        await touchId.load();
        if (!touchId.available) return false;
        const data = await touchId.get(`user::${this.username}`);
        // console.log('touchid data');
        // console.log(data);
        if (!data) return false;
        return Promise.resolve(data)
            .then(JSON.parse)
            .then(this.loginCached)
            .then(() => true)
            .catch(e => {
                console.log('login-state.js: logging in with touch id failed');
                this._resetTouchId = true;
            });
    }
}

const loginState = new LoginState();

addValidation(loginState, 'username', validators.usernameLogin, 0);

export default loginState;
