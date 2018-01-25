const Page = require('../page');

class roomCreationPage extends Page {
    get textInputRoomName() {
        return this.getWhenVisible(`~textInput-channelName`);
    }

    get nextButton() {
        return this.getWhenVisible(`~buttonNext`);
    }

    get textInputContactSearch() {
        return this.getWhenVisible(`~textInputContactSearch`);
    }

    get goButton() {
        return this.getElementInContainer('~chooseContacts', '~buttonGo');
    }

    get recipientContact() {
        return this.getElementInContainer('~foundContacts', `~${process.env.CHAT_RECIPIENT_USER}`);
    }
}

module.exports = roomCreationPage;
