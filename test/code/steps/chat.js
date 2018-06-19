const { defineSupportCode } = require('cucumber');

defineSupportCode(({ When, Then }) => {
    When('I start a new DM with someone', async function () {
        await this.openContactsPickerForDM();
        await this.searchForRecipient();
        await this.contactSelectorPage.recipientContact.click();
    });

    When('I create a new room', async function () {
        this.roomName = new Date().getTime();
        await this.chatListPage.buttonCreateNewChat.click();
        await this.chatActionSheetPage.newRoomOption.click();
        await this.roomCreationPage.textInputRoomName.setValue(this.roomName);
        await this.roomCreationPage.hideKeyboardHelper();
        await this.roomCreationPage.nextButton.click();
        await this.roomCreationPage.goButton.click();
        await this.chatPage.buttonExitChat.click();
    });

    When('I exit the current chat', async function () {
        await this.chatPage.buttonExitChat.click();
    });

    Then('I can send a message to the current chat', async function () {
        const message = `Test Message ${new Date()}`;
        await this.chatPage.textInput.setValue(message);
        await this.chatPage.hideKeyboardHelper();
        await this.chatPage.buttonSendMessage.click();
    });

    Then('They can send a message to the current chat', async function () {
        const message = `Test Message ${new Date()}`;
        await this.chatPage.textInput.setValue(message);
        await this.chatPage.hideKeyboardHelper();
        await this.chatPage.buttonSendMessage.click();
    });

    Then('I recieve placeholder DM', async function () {
        await this.chatListPage.chatWithTitle(this.username).click();
    });

    Then('They recieve placeholder DM', async function () {
        await this.chatListPage.chatWithTitle(process.env.PLACEHOLDERDM_TEST_USER).click();
    });

    Then('I cannot see their DM', async function () {
        const dmExists = await this.chatListPage.chatWithTitleExists(this.username);
        dmExists.should.be.false; // eslint-disable-line
    });

    Then('They cannot see my DM', async function () {
        const dmExists = await this.chatListPage.chatWithTitleExists(process.env.PLACEHOLDERDM_TEST_USER);
        dmExists.should.be.false; // eslint-disable-line
    });

    Then('User accepts placeholder DM', async function () {
        await this.chatPage.messageDmPlaceholder.click();
    });

    Then('User dismisses placeholder DM', async function () {
        await this.chatPage.dismissDmPlaceholder.click();
    });
});
