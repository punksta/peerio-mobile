const webDriver = require('webdriverio');
const iOSFactory = require('./iOSFactory');
const AndroidFactory = require('./AndroidFactory');
const LoginStartPage = require('./pages/login/loginStartPage');
const CreateAccountPage = require('./pages/createAccountPage');
const HomePage = require('./pages/homePage');
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
        this.alertsPage = this.context.alertsPage(this.app);
    }

    closeApp() {
        return this.app
            .removeApp(this.context.bundleId) // remove app so it doesn't influence next test
            .end(); // end server session and close webdriver
    }
}

module.exports = World;
