const Page = require('../page');

class FilesListPage extends Page {
    get firstFile() {
        return this.getWhenVisible('~file0');
    }

    get fileUploadedPopup() {
        return this.getWhenVisible(`~popupButton-ok`);
    }

    get fileSharePreviewPopup() {
        return this.getWhenVisible(`~popupButton-share`);
    }

    get buttonUploadFileToFiles() {
        return this.getWhenVisible('~buttonUploadFileToFiles');
    }
}

module.exports = FilesListPage;
