const Page = require('../page');

class AlertsPage extends Page {
    async dismissNotificationsAlert() {
        if (await this.app.alertText()) {
            await this.app.alertAccept();
        }
    }
}

module.exports = AlertsPage;
