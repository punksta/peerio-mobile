import crypto from 'crypto';
import './btoa-shim';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

global.crypto = crypto;

require('peerio-icebear');

const SocketClient = require('peerio-icebear/src/network/socket-client');
const User = require('peerio-icebear/src/models/user');

const icebear = {
    SocketClient,
    User
};

// export default icebear;
module.exports.SocketClient = SocketClient;
module.exports.User = User;

global.Icebear = icebear;
