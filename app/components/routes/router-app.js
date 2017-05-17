import { BackHandler } from 'react-native';
import { when } from 'mobx';
import Router from './router';
import Login from '../login/login';
import SignupWizard from '../signup/signup-wizard';
import LayoutMain from '../layout/layout-main';
import LoginAutomatic from '../login/login-automatic';
import routerMain from './router-main';
import routes from './routes';

class RouterApp extends Router {
    constructor() {
        super();
        routes.app = this;
        this.add('loginStart', Login.Wizard);
        this.add('loginSaved', Login.Saved);
        this.add('signupStep1', SignupWizard);
        this.add('loginAutomatic', LoginAutomatic);
        this.add('main', LayoutMain, true);

        when(() => this.route === 'main', () => setTimeout(() => routerMain.initial(), 0));
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (routes.modal.route) {
                routes.modal.discard();
                return true;
            }
            routes.main.back();
            return true;
        });
    }
}

export default new RouterApp();
