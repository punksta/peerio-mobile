import { observer } from 'mobx-react/native';
import routerApp from '../routes/router-app';
import LoginWizardPage from './login-wizard-page';

@observer
export default class LoginStart extends LoginWizardPage {
    buttons() {
        return [
            this.button('login', this.props.login),
            this.button('signup', () => routerApp.routes.signupStep1.transition())
        ];
    }
}
