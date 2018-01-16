const Page = require('../page');

class LoginStartPage extends Page {
    get createAccountButton() {
        return this.getWhenVisible('~button_CreateAccount');
    }

    get loginButton() {
        return this.getWhenVisible('~button_login');
    }
}

module.exports = LoginStartPage;
