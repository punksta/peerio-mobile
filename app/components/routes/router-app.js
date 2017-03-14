import { when } from 'mobx';
import Router from './router';
import Login from '../login/login';
import SignupWizard from '../signup/signup-wizard';
import LayoutMain from '../layout/layout-main';
import routerMain from './router-main';

class RouterApp extends Router {
    constructor() {
        super();
        this.add('loginStart', Login.Wizard, true);
        this.add('loginSaved', Login.Saved);
        this.add('signupStep1', SignupWizard);
        this.add('main', LayoutMain);

        when(() => this.route === 'main', () => routerMain.initial());
    }
}

export default new RouterApp();
