/* eslint-disable */
if (typeof __dirname === 'undefined') global.__dirname = '/'
if (typeof __filename === 'undefined') global.__filename = ''
if (typeof process === 'undefined') {
  global.process = require('process')
} else {
  var bProcess = require('process')
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p]
    }
  }
}

process.browser = false
if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer

// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
if (!Uint8Array.prototype.join) {
  Object.defineProperty(Uint8Array.prototype, 'join', {
    value: Array.prototype.join
  });
}

// global.location = global.location || { port: 80 }
var isDev = typeof __DEV__ === 'boolean' && __DEV__
process.env['NODE_ENV'] = isDev ? 'development' : 'production'
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : ''
}

const rnWebSocket = global.WebSocket;
global.WebSocket = function(url) {
  const r = new rnWebSocket(url);
  r.binaryType = 'blob';
  return r;
};

const cryptoShim = require('react-native-crypto');
global.cryptoShim = cryptoShim;

// global.WebSocket = global.originalWebSocket;
// console.log('shim.js binaryType: ', ws.binaryType);
// console.log('shim.js: ', global.originalWebSocket);
