import { when } from 'mobx';
import Router from './router';
import Login from '../login/login';
import SignupWizard from '../signup/signup-wizard';
import LayoutMain from '../layout/layout-main';
import routerMain from './router-main';
import routes from './routes';

class RouterApp extends Router {
    constructor() {
        super();
        routes.app = this;
        this.add('loginStart', Login.Wizard);
        this.add('loginSaved', Login.Saved);
        this.add('signupStep1', SignupWizard);
        this.add('main', LayoutMain, true);

        when(() => this.route === 'main', () => setTimeout(() => routerMain.initial(), 0));
    }
}

export default new RouterApp();
