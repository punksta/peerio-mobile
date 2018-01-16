const webDriver = require('webdriverio');
const iOSFactory = require('./helpers/iOSFactory');
const AndroidFactory = require('./helpers/AndroidFactory');
const LoginStartPage = require('./pages/start/loginStartPage');
const CreateAccountPage = require('./pages/start/createAccountPage');
const LoginPage = require('./pages/start/loginPage');
const HomePage = require('./pages/start/homePage');
const TwoStepVerificationPage = require('./pages/settings/twoStepVerificationPage');
const TwoFactorAuthPrompt = require('./pages/alerts/twoFactorAuthPrompt');
const SettingsPage = require('./pages/settings/settingsPage');

class World {
    constructor(opts) {
        this.context = opts.parameters.platform === 'ios' ? iOSFactory : AndroidFactory;
    }

    openApp() {
        this.app = webDriver.remote(this.context.platform);
        this.app.options.waitforTimeout = 15000;
        this.app.options.screenshotPath = 'test/screenshots';

        this.createPages();

        return this.app.init();
    }

    createPages() {
        this.homePage = new HomePage(this.app);
        this.settingsPage = new SettingsPage(this.app);
        this.loginStartPage = new LoginStartPage(this.app);
        this.createAccountPage = new CreateAccountPage(this.app);
        this.settingsPage = new SettingsPage(this.app);
        this.alertsPage = this.context.alertsPage(this.app);
        this.twoStepVerificationPage = new TwoStepVerificationPage(this.app);
        this.twoFactorAuthPrompt = new TwoFactorAuthPrompt(this.app);
        this.loginPage = new LoginPage(this.app);
    }

    closeApp() {
        return this.app
            .removeApp(this.context.bundleId) // remove app so it doesn't influence next test
            .end(); // end server session and close webdriver
    }
}

module.exports = World;
