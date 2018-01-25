const Page = require('../page');

class HomePage extends Page {
    get welcomeMessage() {
        return this.getWhenVisible('~title_startSecureChat');
    }

    get chatsTab() {
        return this.getWhenVisible('~forum');
    }

    get settingsTab() {
        return this.getWhenVisible('~settings');
    }
}

module.exports = HomePage;
