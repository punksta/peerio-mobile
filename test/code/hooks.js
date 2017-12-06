const { defineSupportCode } = require('cucumber');
const World = require('./world');

const defaultTimeout = 3000000;
defineSupportCode(({ setDefaultTimeout, setWorldConstructor, Before, After }) => {
    setDefaultTimeout(defaultTimeout);

    setWorldConstructor(World);

    Before(function () {
        return this.openApp();
    });

    After(function () {
        return this.closeApp();
    });
});
