const Page = require('./page');

class CreateAccountPage extends Page {
    get createAccountButton() {
        return this.getWhenVisible('~button_CreateAccount');
    }

    get firstName() {
        return this.getWhenVisible('~firstName');
    }

    get lastName() {
        return this.getWhenVisible('~lastName');
    }

    get username() {
        return this.getWhenVisible('~username');
    }

    get email() {
        return this.getWhenVisible('~email');
    }

    get nextButton() {
        return this.getWhenEnabled('~button_next');
    }

    get confirmInput() {
        return this.getWhenVisible('~confirmText');
    }

    get finishButton() {
        return this.getWhenEnabled('~button_finish');
    }
}

module.exports = CreateAccountPage;
