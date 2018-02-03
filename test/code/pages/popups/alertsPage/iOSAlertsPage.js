const Page = require('../../page');

class AlertsPage extends Page {
    async dismissNotificationsAlert() {
        if (await this.app.alertText()) {
            await this.app.alertAccept();
        }
    }

    get emailConfirmationPopup() {
        return this.getWhenVisible('~popupButton-ok');
    }
}

module.exports = AlertsPage;
