const { defineSupportCode } = require('cucumber');
const otplib = require('otplib');

defineSupportCode(({ Given, When, Then }) => {
    let secretKey;

    // Scenario: Enable 2FA for the first time
    async function goTo2FASetup(that) {
        await that.homePage.settingsTab.click();

        await that.settingsPage.securityButton.click();
        await that.settingsPage.twoStepVerificationButton.click();

        secretKey = await that.twoStepVerificationPage.secretKey.getText();
        console.log('Account secret key', secretKey);
    }
    Given('I enable 2FA', async function () {
        await goTo2FASetup(this);
    });

    async function tryEnterTokenInSettings(that) {
        let token = otplib.authenticator.generate(secretKey);
        await that.twoStepVerificationPage.confirmationCode
            .setValue(token)
            .hideDeviceKeyboard();
        await that.twoStepVerificationPage.confirmButton.click();
        await that.twoStepVerificationPage.confirmButton.click(); // TODO: have to tap 2x
    }
    async function enterTokenInSettings(that) {
        await tryEnterTokenInSettings(that);
        if (!(await that.twoStepVerificationPage.backupCodesVisible)) { // Retry if token was expired
            await tryEnterTokenInSettings(that);
        }
    }
    Given('I enter the correct token', async function () {
        await enterTokenInSettings(this);
    });

    async function tryEnterTokenInPrompt(that) {
        const token = otplib.authenticator.generate(secretKey);
        await that.twoFactorAuthPrompt.tokenInput.setValue(token);
        await that.twoFactorAuthPrompt.submitButton.click();
    }
    async function enterTokenInPrompt(that) {
        await tryEnterTokenInPrompt(that);
        if (await that.twoFactorAuthPrompt.tokenInputPresent) { // Retry if token was expired
            await tryEnterTokenInPrompt(that);
        }
    }
    Then('I am prompted to enter a 2FA token', async function () {
        await enterTokenInPrompt(this);
    });

    Given('I enable 2FA on a trusted device', async function () {
        await goTo2FASetup(this);
        await enterTokenInSettings(this);
        await this.app.closeApp();
        await this.app.launch();
        await this.twoFactorAuthPrompt.trustDeviceCheckbox.click();
        await enterTokenInPrompt(this);
    });

    Given('I enable 2FA on an untrusted device', async function () {
        await goTo2FASetup(this);
        await enterTokenInSettings(this);
        await this.app.closeApp();
        await this.app.launch();
        await enterTokenInPrompt(this);
    });
});
