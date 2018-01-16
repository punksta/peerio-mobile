const { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ Given, When, Then }) {
    let username;
    let passphrase;

    // Scenario: User signs up successfully
    async function selectCreateAccount(that) {
        await that.alertsPage.dismissNotificationsAlert();
        await that.loginStartPage.createAccountButton.click();
    }
    When('I choose the create account option', function () {
        return selectCreateAccount(this);
    });

    async function typePersonalInfo(that) {
        username = new Date().getTime();
        console.log('Creating account with username', username);

        await that.createAccountPage.firstName.setValue('test-first-name').hideDeviceKeyboard();
        await that.createAccountPage.lastName.setValue('test-last-name').hideDeviceKeyboard();
        await that.createAccountPage.username.setValue(username).hideDeviceKeyboard();
        await that.createAccountPage.email.setValue('test@email.io').hideDeviceKeyboard();
        await that.createAccountPage.nextButton.click();
    }
    When('I input my personal info', async function () {
        await typePersonalInfo(this);
    });

    async function savePasscode(that) {
        await that.createAccountPage.passphrase.getText().then(innerText => {
            passphrase = innerText;
        });
        console.log('Creating account with passphrase', passphrase);
        await that.createAccountPage.nextButton.click();
    }
    Then('I am presented with my passcode', async function () {
        await savePasscode(this);
    });

    async function confirmSavingPasscode(that) {
        await that.createAccountPage.confirmInput.setValue('I have saved my account key').hideDeviceKeyboard();
        await that.createAccountPage.finishButton.click();
    }
    Then('I confirm that I saved my passcode', async function () {
        await confirmSavingPasscode(this);
    });

    Then('I am taken to the Login Start screen', async function () {
        await this.loginStartPage.loginButton;
    });

    async function seeWelcomeScreen(that) {
        await that.homePage.chatsTab.isExisting();
    }
    Then('I am taken to the home tab', function () {
        return seeWelcomeScreen(this);
    });

    // Scenario: Autologin
    Given('I have signed up', async function () {
        await selectCreateAccount(this);
        await typePersonalInfo(this);
        await savePasscode(this);
        await confirmSavingPasscode(this);
        await seeWelcomeScreen(this);
    });

    Given('I close Peerio', async function () {
        await this.app.closeApp();
    });

    When('I open Peerio', async function () {
        await this.app.launch();
    });

    Given('I sign out', async function () {
        await this.homePage.settingsTab.click();
        await this.settingsPage.logoutButton.click();
        await this.settingsPage.logoutButton.click(); // TODO: need to tap 2x
        await this.settingsPage.lockButton.click();
    });

    When('I sign in', async function () {
        await this.createAccountPage.loginButton.click();
        await this.loginPage.username.setValue(username).hideDeviceKeyboard();
        await this.loginPage.passphrase.setValue(passphrase).hideDeviceKeyboard();
        await this.loginPage.submitButton.click();
    });
});
