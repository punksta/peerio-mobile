const Page = require('../../page');

class AlertsPage extends Page {
    async dismissNotificationsAlert() {

    }

    get emailConfirmationPopup() {
        return this.getWhenVisible('~popupButton-ok');
    }
}

module.exports = AlertsPage;
