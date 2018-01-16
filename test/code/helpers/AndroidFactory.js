const { android } = require('../platforms');
const AlertsPage = require('../pages/alerts/alertsPage/AndroidAlertsPage');

class AndroidFactory {
    get bundleId() { return 'com.peerio.app'; }
    get platform() { return android; }
    alertsPage(app) { return new AlertsPage(app); }
}

module.exports = new AndroidFactory();
