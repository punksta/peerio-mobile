const { iOSBuildPath, androidBuildPath } = require('./buildPaths');

const iOS = {
    port: 4723,
    desiredCapabilities: {
        platformName: 'iOS',
        platformVersion: process.env.PEERIO_IOS_VERSION || '10.3',
        deviceName: process.env.PEERIO_IOS_SIM || 'iPhone 6s',
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
