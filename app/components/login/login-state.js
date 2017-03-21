import { when, observable, action } from 'mobx';
import RNRestart from 'react-native-restart';
import mainState from '../main/main-state';
import { User, validation, fileStore, socket } from '../../lib/icebear';
import touchId from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';

const { validators, addValidation } = validation;
const { isValidLoginUsername } = validators;

class LoginState extends RoutedState {
    @observable username = '';
    @observable usernameValid = null;
    @observable firstName = '';
    @observable lastName = '';
    @observable passphrase = '';
    @observable passphraseValidationMessage = null;
    @observable changeUser = false;
    @observable savedUserInfo = false;
    @observable isInProgress = false;
    _prefix = 'login';

    @action changeUserAction() {
        if (this.isInProgress) return;
        this.changeUser = true;
        this.clean();
    }

    @action clean() {
        console.log('transitioning to clean');
        this.username = '';
        this.usernameValid = null;
        this.passphrase = '';
        this.savedUserInfo = false;
        this.isInProgress = false;
        this.routes.app.loginStart();
    }

    @action saved() {
        this.savedUserInfo = true;
        this.routes.app.loginSaved();
    }

    @action _login(user) {
        console.log(`login-state.js: logging in ${user.username}`);
        return isValidLoginUsername(user.username)
            .then(valid => {
                if (valid) {
                    return user.login();
                }
                return Promise.reject(new Error('login-state.js: bad username'));
            })
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

    @action login(pin) {
        const user = new User();
        user.username = this.username;
        user.passphrase = pin || this.passphrase || 'such a secret passphrase';
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        }).catch(e => console.log(e));
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
        if (userData) {
            const { username, firstName, lastName } = userData;
            if (this.username && this.username !== username) return false;
            this.username = username;
            this.username && this.triggerTouchId();
            console.log(`login-state.js: loaded ${userData}`);
            // we logged in with someone else
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            const user = new User();
            user.username = username;
            return user.hasPasscode()
                .then(result => {
                    console.log(`login-state.js: ${result}`);
                    result && this.saved();
                });
        }
        return false;
    }

    @action async triggerTouchId() {
        await touchId.load();
        touchId.available && touchId.get(`user::${this.username}`)
            .then(data => {
                if (data) {
                    this.loginCached(JSON.parse(data));
                }
            });
    }
}

const loginState = new LoginState();

addValidation(loginState, 'username', validators.usernameLogin, 0);

export default loginState;
