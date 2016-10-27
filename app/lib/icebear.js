import './btoa-shim';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const icebear = require('peerio-icebear');

const { socket, config } = icebear;

config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
socket.start();

module.exports = icebear;

global.icebear = icebear;
