const webDriver = require('webdriverio');
const CreateAccountPage = require('./pages/login/createAccountPage');
const ChatListPage = require('./pages/messaging/chatListPage');
const ContactSelectorDmPage = require('./pages/messaging/contactSelectorDmPage');
const ChatPage = require('./pages/messaging/chatPage');
const RoomCreationPage = require('./pages/messaging/roomCreationPage');
const iOSFactory = require('./helpers/iOSFactory');
const AndroidFactory = require('./helpers/AndroidFactory');
const StartPage = require('./pages/start/startPage');
const LoginPage = require('./pages/login/loginCredentialsPage');
const HomePage = require('./pages/start/homePage');
const TwoStepVerificationPage = require('./pages/settings/twoStepVerificationPage');
const TwoFactorAuthPrompt = require('./pages/popups/twoFactorAuthPrompt');
const SettingsPage = require('./pages/settings/settingsPage');
const AccountSettingsPage = require('./pages/settings/accountSettingsPage');
const otplib = require('otplib');

class World {
    constructor(opts) {
        this.context = opts.parameters.platform === 'ios' ? iOSFactory : AndroidFactory;
    }

    openApp() {
        this.app = webDriver.remote(this.context.platform);
        this.app.options.waitforTimeout = 15000;
        this.app.options.screenshotPath = 'test/screenshots';

        this.createPages();

        return this.app.init();
    }

    createPages() {
        this.startPage = new StartPage(this.app);
        this.loginPage = new LoginPage(this.app);
        this.createAccountPage = new CreateAccountPage(this.app);
        this.homePage = new HomePage(this.app);
        this.alertsPage = this.context.alertsPage(this.app);

        this.chatListPage = new ChatListPage(this.app);
        this.contactSelectorDmPage = new ContactSelectorDmPage(this.app);
        this.roomCreationPage = new RoomCreationPage(this.app);
        this.chatPage = new ChatPage(this.app);
        this.chatActionSheetPage = this.context.chatActionSheetPage(this.app);

        this.settingsPage = new SettingsPage(this.app);
        this.accountSettingsPage = new AccountSettingsPage(this.app);
        this.twoStepVerificationPage = new TwoStepVerificationPage(this.app);
        this.twoFactorAuthPrompt = new TwoFactorAuthPrompt(this.app);
    }

    closeApp() {
        return this.app
            .removeApp(this.context.bundleId) // remove app so it doesn't influence next test
            .end(); // end server session and close webdriver
    }

    async goTo2FASetup() {
        await this.homePage.settingsTab.click();

        await this.settingsPage.securityButton.click();
        await this.settingsPage.twoStepVerificationButton.click();

        this.secretKey = await this.twoStepVerificationPage.secretKey.getText();
        console.log('Account secret key', this.secretKey);
    }

    async tryEnterTokenInSettings() {
        const token = otplib.authenticator.generate(this.secretKey);
        await this.twoStepVerificationPage.confirmationCode
            .setValue(token)
            .hideDeviceKeyboard();
        await this.twoStepVerificationPage.confirmButton.click();
        await this.twoStepVerificationPage.confirmButton.click(); // TODO: have to tap 2x
    }

    async enterTokenInSettings() {
        await this.tryEnterTokenInSettings();
        if (!(await this.twoStepVerificationPage.backupCodesVisible)) { // Retry if token was expired
            await this.tryEnterTokenInSettings();
        }
    }

    async tryEnterTokenInPrompt() {
        const token = otplib.authenticator.generate(this.secretKey);
        await this.twoFactorAuthPrompt.tokenInput.setValue(token);
        await this.twoFactorAuthPrompt.submitButton.click();
        await this.twoFactorAuthPrompt.submitButton.click(); // TODO tap twice
    }

    async enterTokenInPrompt() {
        await this.tryEnterTokenInPrompt();
        if (await this.twoFactorAuthPrompt.tokenInputPresent) { // Retry if token was expired
            await this.tryEnterTokenInPrompt();
        }
    }

    async selectCreateAccount() {
        await this.alertsPage.dismissNotificationsAlert();
        await this.startPage.createAccountButton.click();
    }

    async typePersonalInfo() {
        this.username = new Date().getTime();
        this.email = `${this.username}@test.lan`;
        console.log('Creating account with username', this.username);

        await this.createAccountPage.firstName.setValue('test-first-name').hideDeviceKeyboard();
        await this.createAccountPage.lastName.setValue('test-last-name').hideDeviceKeyboard();
        await this.createAccountPage.username.setValue(this.username).hideDeviceKeyboard();
        await this.createAccountPage.email.setValue(this.email).hideDeviceKeyboard();
        await this.createAccountPage.nextButton.click();
    }

    async savePasscode() {
        await this.createAccountPage.passphrase.getText().then(innerText => {
            this.passphrase = innerText;
        });
        console.log('Creating account with passphrase', this.passphrase);
        await this.createAccountPage.nextButton.click();
    }

    async confirmSavingPasscode() {
        await this.createAccountPage.confirmInput.setValue('I have saved my account key').hideDeviceKeyboard();
        await this.createAccountPage.finishButton.click();
    }

    async seeWelcomeScreen() {
        await this.homePage.chatsTab;
    }

    async dismissEmailConfirmationPopup() {
        if (this.alertsPage.emailConfirmationPopup.isVisible()) {
            this.alertsPage.emailConfirmationPopup.click();
        }
    }

    async loginExistingAccount(username, passphrase) {
        await this.alertsPage.dismissNotificationsAlert();
        await this.startPage.loginButton.click();
        await this.loginPage.username.setValue(username).hideDeviceKeyboard();
        await this.loginPage.passphrase.setValue(passphrase).hideDeviceKeyboard();

        // iOS taps on 'Done' button when hides device keyboard
        // Android taps outside
        // 'tapOutside' strategy passed to hideDeviceKeyboard still taps on 'Done' button
        if (this.context.platform.desiredCapabilities.platformName === 'Android') {
            await this.loginPage.submitButton.click();
        }
        await this.seeWelcomeScreen();
        await this.dismissEmailConfirmationPopup();
    }

    async createNewAccount() {
        await this.selectCreateAccount();
        await this.typePersonalInfo();
        await this.savePasscode();
        await this.confirmSavingPasscode();
        await this.seeWelcomeScreen();
        await this.dismissEmailConfirmationPopup();
    }
}

module.exports = World;
