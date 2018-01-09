const { defineSupportCode } = require('cucumber');

defineSupportCode(({ When }) => {
    When('I sign out', async function () {
        await this.homePage.settingsTab.click();
        await this.settingsPage.buttonSignOut.click();
        await this.settingsPage.signOutPopup.click();
    });
});
