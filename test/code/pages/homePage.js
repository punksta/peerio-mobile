const Page = require('./page');

class HomePage extends Page {
    get welcomeMessage() {
        return this.getWhenVisible('~title_welcomeHeading');
    }
}

module.exports = HomePage;
