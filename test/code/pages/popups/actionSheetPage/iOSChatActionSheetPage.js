const Page = require('../../page');

class ChatActionSheetPage extends Page {
    get newDmOption() {
        return this.getWhenVisible('~New Direct Message');
    }

    get newRoomOption() {
        return this.getWhenVisible('~New Room');
    }
}

module.exports = ChatActionSheetPage;
