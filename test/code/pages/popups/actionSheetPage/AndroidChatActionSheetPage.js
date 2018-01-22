const Page = require('../../page');
const { selectorWithText } = require('../../../helpers/androidHelper');

class ChatActionSheetPage extends Page {
    get newDmOption() {
        const newDmOptionSelector = selectorWithText('New Direct Message');
        return this.getWhenVisible(newDmOptionSelector);
    }

    get newRoomOption() {
        const newRoomOptionSelector = selectorWithText('New Room');
        return this.getWhenVisible(newRoomOptionSelector);
    }
}

module.exports = ChatActionSheetPage;
