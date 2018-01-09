const Page = require('../page');

class SettingsPage extends Page {
    get buttonSignOut() {
        return this.getWhenVisible('~button_signOut');
    }

    get signOutPopup() {
        return this.getWhenVisible(`~popupButton-yes`);
    }
}

module.exports = SettingsPage;
