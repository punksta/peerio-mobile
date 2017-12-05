class Page {
    constructor(app) {
        this.app = app;
    }

    getWhenVisible(selector) {
        return this.app
            .waitForExist(selector)
            .element(selector);
    }

    getWhenEnabled(selector) {
        return this.app
            .waitForExist(selector)
            .waitForEnabled(selector)
            .element(selector);
    }
}

module.exports = Page;
