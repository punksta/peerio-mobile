const { defineSupportCode } = require('cucumber');

defineSupportCode(({ When, Then }) => {
    When('I choose the create account option', async function () {
        if (this.app.options.desiredCapabilities.platformName === 'iOS') {
            if (await this.app.alertText()) {
                await this.app.alertAccept();
            }
        }

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

    Then('I am taken to the home tab', function () {
        return this.homePage.welcomeMessage;
    });
});
