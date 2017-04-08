import { when, observable, action } from 'mobx';
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

    @action changeUserAction() {
        if (this.isInProgress) return;
        this.changeUser = true;
        this.clean();
    }

    @action checkSavedUserPin() {
        const user = new User();
        user.username = this.username;
        return user.hasPasscode().then(has => has && this.saved());
    }

    @action useMasterPassword() {
        this.current = 2;
        this.routes.app.loginStart();
    }

    @action clean() {
        console.log('transitioning to clean');
        this.current = 0;
        this.username = '';
        this.usernameValid = null;
        this.passphrase = '';
        this.isInProgress = false;
        this.routes.app.loginStart();
    }

    @action saved = () => this.routes.app.loginSaved();

    @action _login(user) {
        console.log(`login-state.js: logging in ${user.username}`);
        return user.login()
            .then(() => console.log('login-state.js: logged in'))
            .then(() => mainState.activateAndTransition(user))
            .catch(e => {
                console.error(e);
                this.passphraseValidationMessage = tx('incorrectPasswordOrPINTitle');
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

    @action loginCached(data) {
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
            tx('popup_areYouSure'),
            tx('popup_fileTasksNotCompleted')) : Promise.resolve(true)
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
            await this.triggerTouchId();
            this.isInProgress = false;
        }
        console.log(`login-state.js: loaded`);
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        const user = new User();
        user.username = username;
        if (await user.hasPasscode()) this.saved();
    }

    @action async triggerTouchId() {
        await touchId.load();
        if (!touchId.available) return false;
        const data = await touchId.get(`user::${this.username}`);
        if (!data) return false;
        return this.loginCached(JSON.parse(data));
    }
}

const loginState = new LoginState();

addValidation(loginState, 'username', validators.usernameLogin, 0);

export default loginState;
