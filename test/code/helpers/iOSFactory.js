const { iOS } = require('../platforms');
const AlertsPage = require('../pages/popups/alertsPage/iOSAlertsPage');
const ChatActionSheetPage = require('../pages/popups/actionSheetPage/iOSChatActionSheetPage');

class iOSFactory {
    get bundleId() { return 'com.peerio'; }
    get platform() { return iOS; }
    alertsPage(app) { return new AlertsPage(app); }
    chatActionSheetPage(app) { return new ChatActionSheetPage(app); }
}

module.exports = new iOSFactory();

