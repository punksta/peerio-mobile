const Page = require('../page');

class ContactSelectorDmPage extends Page {
    get recipientContact() {
        return this.getElementInContainer('~foundContacts', `~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get textInput() {
        return this.getWhenVisible(`~textInputContactSearch`);
    }
}

module.exports = ContactSelectorDmPage;
