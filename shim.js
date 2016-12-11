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

// global.location = global.location || { port: 80 }
var isDev = typeof __DEV__ === 'boolean' && __DEV__
process.env['NODE_ENV'] = isDev ? 'development' : 'production'
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : ''
}

// global.WebSocket = global.originalWebSocket;
const rnWebSocket = global.WebSocket;
global.WebSocket = function() {
  const r = new rnWebSocket(...arguments);
  r.binaryType = 'blob';
  return r;
};

const ws = new WebSocket('ws://localhost:8081')
console.log('shim.js binaryType: ', ws.binaryType);
// console.log('shim.js: ', global.originalWebSocket);
