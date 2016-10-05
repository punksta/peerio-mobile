global.navigator = window.navigator || {};
global.navigator.userAgent = window.navigator.userAgent || 'react-native';

require('peerio-icebear');

const SocketClient = require('peerio-icebear/src/network/socket-client');

export default {
    SocketClient
};
