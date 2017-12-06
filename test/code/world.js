const webDriver = require('webdriverio');
const { iOS, android } = require('./platforms');
const CreateAccountPage = require('./pages/createAccount');
const HomePage = require('./pages/homePage');

class World {
    constructor(opts) {
        if (opts.parameters.platform === 'ios') {
            this.platform = iOS;
        } else {
            this.platform = android;
        }
    }

    openApp() {
        this.app = webDriver.remote(this.platform);
        this.app.options.waitforTimeout = 15000;
        this.app.options.screenshotPath = 'test/screenshots';
        this.createPages();
        return this.app.init();
    }

    createPages() {
        this.homePage = new HomePage(this.app);
        this.createAccountPage = new CreateAccountPage(this.app);
    }

    closeApp() {
        return this.app.end();
    }
}

module.exports = World;
