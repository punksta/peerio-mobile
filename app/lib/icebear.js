import './btoa-shim';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';
global.cryptoShim = require('react-native-crypto');

const Promise = require('bluebird');

Promise.config({
    // Enables all warnings except forgotten return statements.
    warnings: {
        wForgottenReturn: false
    }
});

const icebear = require('./peerio-icebear/src');

const { socket, config } = icebear;

config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
socket.start();

module.exports = icebear;

global.icebear = icebear;
