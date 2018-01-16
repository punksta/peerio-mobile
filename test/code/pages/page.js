class Page {
    constructor(app) {
        this.app = app;
    }

    // Check if element exists, not necessarily visible
    checkIfPresent(selector) {
        return this.app.isExisting(selector);
    }

    // Check if element exists and is visible
    checkIfVisible(selector) {
        return this.app
            .isExisting(selector)
            .isVisible(selector);
    }

    // Element exists on page, not necessarily visible
    getWhenPresent(selector) {
        return this.app
            .waitForExist(selector)
            .element(selector);
    }

    // Element is visible on page
    getWhenVisible(selector) {
        return this.app
            .waitForExist(selector)
            .element(selector);
    }

    // Element is visible and can be pressed
    getWhenEnabled(selector) {
        return this.app
            .waitForExist(selector)
            .waitForEnabled(selector)
            .element(selector);
    }
}

module.exports = Page;
