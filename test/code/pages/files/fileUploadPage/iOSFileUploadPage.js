const Page = require('../../page');

class iOSFileUploadPage extends Page {
    async uploadFileFromGallery() {
        await this.app.element('~Upload from gallery').click();

        try {
            await this.app.waitForExist('~OK').click('~OK');
        } catch (e) {
            // no permissions alert present
        }

        await this.app
            .waitForVisible('~Moments')
            .click('~Moments')
            .waitForVisible('~Photo, Landscape, August 08, 2012, 9:52 PM')
            .click('~Photo, Landscape, August 08, 2012, 9:52 PM');
    }
}

module.exports = iOSFileUploadPage;
