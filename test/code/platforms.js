const { iOSBuildPath, androidBuildPath } = require('./buildPaths');

const iOS = {
    port: 4723,
    desiredCapabilities: {
        platformName: 'iOS',
        platformVersion: '10.3',
        deviceName: 'iPhone 6s',
        app: iOSBuildPath
    }
};

const android = {
    port: 4723,
    desiredCapabilities: {
        platformName: 'Android',
        platformVersion: '6.0',
        deviceName: 'Android 6',
        app: androidBuildPath
    }
};

module.exports = { iOS, android };
