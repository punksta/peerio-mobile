const Page = require('../page');

class ChatListPage extends Page {
    get buttonCreateNewChat() {
        return this.getWhenVisible('~buttonCreateNewChat');
    }

    chatWithTitle(selector) {
        return this.getWhenPresent(`~${selector}`);
    }

    chatWithTitleVisible(selector) {
        return this.checkIfVisible(`~${selector}`);
    }

    chatWithTitleExists(selector) {
        return this.checkIfPresent(`~${selector}`, 25000);
    }
}

module.exports = ChatListPage;
