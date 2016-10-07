import crypto from 'crypto';
import './btoa-shim';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

global.crypto = crypto;

const { User, socket, config } = require('peerio-icebear');
config.socketServerUrl = 'wss://***REMOVED***/';
socket.start();

// const icebear = {
//     SocketClient: null,
//     User: null
// };

// export default icebear;
module.exports.config = config;
module.exports.socket = socket;
module.exports.User = User;

global.socket = socket;
