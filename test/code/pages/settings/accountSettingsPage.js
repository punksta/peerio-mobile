const Page = require('../page');

class AccountSettingsPage extends Page {
    get deleteAccountButton() {
        return this.getWhenVisible('~button_accountDelete');
    }

    get confirmDeleteButton() {
        return this.getWhenPresent('~title_settingsAccount');
    }
}

module.exports = AccountSettingsPage;
