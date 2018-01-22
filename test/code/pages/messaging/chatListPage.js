const Page = require('../page');

class ChatListPage extends Page {
    get welcomeMessage() {
        return this.getWhenVisible('~title_startSecureChat');
    }

    get buttonCreateNewChat() {
        return this.getWhenVisible('~buttonCreateNewChat');
    }
}

module.exports = ChatListPage;
