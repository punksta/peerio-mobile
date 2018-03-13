const Page = require('../page');

class ChatListPage extends Page {
    get buttonCreateNewChat() {
        return this.getWhenVisible('~buttonCreateNewChat');
    }
}

module.exports = ChatListPage;
