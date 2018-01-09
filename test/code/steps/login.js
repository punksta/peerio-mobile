const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, When, Then }) => {
    // Scenario: User signs up successfully
    When('I choose the create account option', async function () {
        await this.alertsPage.dismissNotificationsAlert();
        await this.createAccountPage.createAccountButton.click();
    });

    When('I input my personal info', async function () {
        await this.createAccountPage.firstName.setValue('test-first-name').hideDeviceKeyboard();
        await this.createAccountPage.lastName.setValue('test-last-name').hideDeviceKeyboard();
        await this.createAccountPage.username.setValue(new Date().getTime()).hideDeviceKeyboard();
        await this.createAccountPage.email.setValue('test@email.io').hideDeviceKeyboard();
        await this.createAccountPage.nextButton.click();
    });

    Then('I am presented with my passcode', async function () {
        await this.app.pause(5000); // wait / check for something?
        await this.createAccountPage.nextButton.click();
    });

    Then('I confirm that I saved my passcode', async function () {
        await this.createAccountPage.confirmInput.setValue('I have saved my account key').hideDeviceKeyboard();
        await this.createAccountPage.finishButton.click();
    });

    Then('I am taken to the Login Start screen', async function () {
        await this.loginStartPage.signInButton; // Verify that the correct screen is shown
    });

    Then('I am taken to the home tab', function () {
        return this.homePage.welcomeMessage;
    });

    // Scenario: Autologin
    Given('I have signed up', async function () {
        await this.alertsPage.dismissNotificationsAlert();
        await this.createAccountPage.createAccountButton.click();

        await this.createAccountPage.firstName.setValue('test-first-name').hideDeviceKeyboard();
        await this.createAccountPage.lastName.setValue('test-last-name').hideDeviceKeyboard();
        await this.createAccountPage.username.setValue(new Date().getTime()).hideDeviceKeyboard();
        await this.createAccountPage.email.setValue('test@email.io').hideDeviceKeyboard();
        await this.createAccountPage.nextButton.click();

        await this.app.pause(5000);
        await this.createAccountPage.nextButton.click();

        await this.createAccountPage.confirmInput.addValue('I have saved my account key').hideDeviceKeyboard();
        await this.createAccountPage.finishButton.click();
        await this.homePage.welcomeMessage.click();
    });

    Given('I close Peerio', async function () {
        await this.app.closeApp();
    });

    When('I open Peerio', async function () {
        await this.app.launch();
    });
});
