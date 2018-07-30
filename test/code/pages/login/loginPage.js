const Page = require('../page');

class LoginPage extends Page {
    get username() {
        return this.getWhenVisible('~usernameLogin');
    }

    get passphrase() {
        return this.getWhenVisible('~usernamePassword');
    }

    get submitButton() {
        return this.getWhenEnabled('~button_login');
    }
}

module.exports = LoginPage;
