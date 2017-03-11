import Router from './router';
import Login from '../login/login';
import Signup from '../signup/signup';
import SignupWizard from '../signup/signup-wizard';
import LayoutMain from '../layout/layout-main';

class RouterApp extends Router {
    constructor(props) {
        super(props);
        this.add('loginStart', Login.Wizard, true);
        this.add('loginSaved', Login.Saved);
        this.add('signupStep1', SignupWizard);
        // this.add('signupStep2', Signup.Pin);
        this.add('main', LayoutMain, true);
    }
}

export default new RouterApp();
