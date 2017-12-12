const { iOS } = require('./platforms');
const AlertsPage = require('./pages/alertsPage/iOSAlertsPage');

class iOSFactory {
    get bundleId() { return 'com.peerio'; }
    get platform() { return iOS; }
    alertsPage(app) { return new AlertsPage(app); }
}

module.exports = new iOSFactory();

