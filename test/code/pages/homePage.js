const Page = require('./page');

class HomePage extends Page {
    get welcomeMessage() {
        return this.getWhenVisible('~title_startSecureChat');
    }

    get settingsTab() {
        return this.getWhenVisible('~settings-tab');
    }
}

module.exports = HomePage;
