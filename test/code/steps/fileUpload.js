const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Then }) => {
    Then('I upload a file from gallery to Files', async function () {
        await this.homePage.filesTab.click();
        await this.filesListPage.buttonUploadFileToFiles.click();
        await this.fileUploadPage.uploadFileFromGallery();
        await this.filesListPage.fileUploadedPopup.click();
    });

    Then('I upload a file from gallery to the current Chat', async function () {
        await this.chatPage.buttonUploadToChat.click();
        await this.fileUploadPage.uploadFileFromGallery();
        await this.filesListPage.fileSharePreviewPopup.click();
    });

    Then('I can download the file from Files', async function () {
        await this.homePage.filesTab.click();
        await this.filesListPage.firstFile.click();

        // Wait for download button to be enabled
        await this.app.pause(5000);

        await this.fileViewPage.fileDownloadTab.click();

        if (this.context.platform.desiredCapabilities.platformName === 'Android') {
            await this.fileViewPage.encryptionRecommendationPopup.click();
            await this.fileViewPage.filesDecryptedPopup.click();
        }

        await this.fileViewPage.fileOpenTab.click();
    });
});
