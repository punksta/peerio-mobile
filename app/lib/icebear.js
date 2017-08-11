import './btoa-shim';
import mobileConfig from './mobile-config';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const icebear = require('./peerio-icebear');

const { socket, config, FileStreamAbstract, TinyDb } = icebear;
mobileConfig(config, { FileStreamAbstract });

const OVERRIDE_SERVER_KEY = 'socketServerOverride';

icebear.overrideServer = async function(value) {
    return value ?
        await TinyDb.system.setValue(OVERRIDE_SERVER_KEY, value) :
        await TinyDb.system.removeValue(OVERRIDE_SERVER_KEY);
};

icebear.startSocket = async function() {
    const serverOverride = await TinyDb.system.getValue(OVERRIDE_SERVER_KEY);
    if (serverOverride) {
        console.log('icebear.js: Overriding server name');
        config.socketServerUrl = serverOverride;
    }
    console.log(`icebear.js: Starting connection to ${config.socketServerUrl}`);
    socket.start();
};

global.icebear = icebear;
// eslingignore
if (window) window.icebear = icebear;
module.exports = icebear;
