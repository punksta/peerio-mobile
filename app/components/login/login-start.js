import { observer } from 'mobx-react/native';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';

@observer
export default class LoginStart extends LoginWizardPage {
    buttons() {
        return [
            this.button('login', this.props.login),
            this.button('signup', () => loginState.routes.app.signupStep1())
        ];
    }
}
