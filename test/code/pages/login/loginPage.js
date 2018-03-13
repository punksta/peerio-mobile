const Page = require('../page');

class LoginPage extends Page {
    get username() {
        return this.getWhenVisible('~username');
    }

    get passphrase() {
        return this.getWhenVisible('~passphrase');
    }

    get submitButton() {
        return this.getWhenEnabled('~button_login');
    }

    get invalidKeyLabelShown() {
        return this.checkIfVisible('~Invalid Account Key');
    }
}

module.exports = LoginPage;
