const Page = require('../page');

class SettingsPage extends Page {
    get securityButton() {
        return this.getWhenVisible('~title_settingsSecurity');
    }

    get accountButton() {
        return this.getWhenPresent('~title_settingsAccount');
    }

    get logoutButton() {
        return this.getWhenPresent('~button_logout');
    }

    get twoStepVerificationButton() {
        return this.getWhenVisible('~title_2FA');
    }

    get lockButton() {
        return this.getWhenVisible('~popupButton-yes');
    }
}

module.exports = SettingsPage;
