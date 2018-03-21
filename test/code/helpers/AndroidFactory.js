const { android } = require('../platforms');
const AlertsPage = require('../pages/popups/alertsPage/AndroidAlertsPage');
const ChatActionSheetPage = require('../pages/popups/actionSheetPage/AndroidChatActionSheetPage');
const FileUploadPage = require('../pages/files/fileUploadPage/AndroidFileUploadPage');

class AndroidFactory {
    get bundleId() { return 'com.peerio.app'; }
    get platform() { return android; }
    alertsPage(app) { return new AlertsPage(app); }
    chatActionSheetPage(app) { return new ChatActionSheetPage(app); }
    fileUploadPage(app) { return new FileUploadPage(app); }
}

module.exports = new AndroidFactory();
