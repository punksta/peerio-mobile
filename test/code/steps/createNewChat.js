const { defineSupportCode } = require('cucumber');

defineSupportCode(({ When, Then }) => {
    When('I start a new DM with a User', async function () {
        await this.chatListPage.buttonCreateNewChat.click();
        await this.chatActionSheetPage.newDmOption.click();
        await this.contactSelectorDmPage.textInput.setValue(process.env.CHAT_RECIPIENT_USER).hideDeviceKeyboard();
        await this.contactSelectorDmPage.recipientContact.click();
        await this.contactSelectorDmPage.recipientContact.click(); // TODO: Remove double click when bug is fixed
    });

    When('I create a new Room', async function () {
        const roomName = new Date().getTime();
        await this.chatListPage.buttonCreateNewChat.click();
        await this.chatActionSheetPage.newRoomOption.click();
        await this.roomCreationPage.textInputRoomName.setValue(roomName).hideDeviceKeyboard();
        await this.roomCreationPage.nextButton.click();
        await this.roomCreationPage.nextButton.click(); // TODO: Remove double click when bug is fixed
        await this.roomCreationPage.textInputContactSearch.setValue(process.env.CHAT_RECIPIENT_USER).hideDeviceKeyboard();
        await this.roomCreationPage.recipientContact.click();
        await this.roomCreationPage.goButton.click();
    });

    Then('I can send a message to the current Chat', async function () {
        const message = `Test Message ${new Date()}`;
        await this.chatPage.textInput.setValue(message).hideDeviceKeyboard();
        await this.chatPage.buttonSendMessage.click();
    });
});
