const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, When, Then }) => {
    const existingUsers = {
        create_dm_test: {
            name: process.env.CREATE_DM_TEST_USER,
            passphrase: process.env.CREATE_DM_TEST_PASS
        },
        room_test: {
            name: process.env.CREATE_ROOM_TEST_USER,
            passphrase: process.env.CREATE_ROOM_TEST_PASS
        }
    };

    // Scenario: User signs up successfully
    When('I choose the create account option', function () {
        return this.selectCreateAccount();
    });

    When('I input my personal info', async function () {
        await this.typePersonalInfo();
    });

    Then('I am presented with my passcode', async function () {
        await this.savePasscode();
    });

    Then('I confirm that I saved my passcode', async function () {
        await this.confirmSavingPasscode();
    });

    Then('I am taken to the Login Start screen', async function () {
        await this.startPage.loginButton;
    });

    Then('I am taken to the home tab', function () {
        return this.seeWelcomeScreen();
    });

    // Scenario: Autologin
    Given('I have signed up', async function () {
        await this.createNewAccount();
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
        await this.loginExistingAccount(this.username, this.passphrase);
    });

    When('I log in as {word} user', async function (string) {
        if (string === 'new') {
            await this.createNewAccount();
        } else {
            const credentials = existingUsers[string];
            await this.loginExistingAccount(credentials.name, credentials.passphrase);
        }
    });

    When('I delete my account', async function () {
        await this.homePage.settingsTab.click();
        await this.settingsPage.accountButton.click();
        await this.accountSettingsPage.deleteAccountButton.click();
        await this.accountSettingsPage.confirmDeleteButton.click();
    });

    Then('I can not login with my credentials', async function () {

    });
});

