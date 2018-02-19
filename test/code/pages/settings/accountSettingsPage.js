const Page = require('../page');

class AccountSettingsPage extends Page {
    get deleteAccountButton() {
        return this.getWhenVisible('~button_accountDelete');
    }

    get confirmDeleteButton() {
        return this.getWhenVisible('~popupButton-copy');
    }

    get confirmSuspendedButton() {
        return this.getWhenVisible('~popupButton-ok');
    }

    get logoutButton() {
        return this.getWhenVisible('~popupButton-yes');
    }
}

module.exports = AccountSettingsPage;
