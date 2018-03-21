const Page = require('../page');
const { selectorWithText } = require('../../helpers/androidHelper');

class FileViewPage extends Page {
    get fileDownloadTab() {
        return this.getWhenEnabled(`~file-download-tab`);
    }

    get fileOpenTab() {
        return this.getWhenEnabled(`~open-in-new-tab`);
    }
    get encryptionRecommendationPopup() {
        const cancelButtonSelector = selectorWithText('CANCEL');
        return this.getWhenVisible(cancelButtonSelector);
    }

    get filesDecryptedPopup() {
        const okButtonSelector = selectorWithText('OK');
        return this.getWhenVisible(okButtonSelector);
    }
}

module.exports = FileViewPage;
