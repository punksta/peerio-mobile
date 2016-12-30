import { reaction } from 'mobx';
import './btoa-shim';
import rnFileStream from './rn-file-stream';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const Promise = require('bluebird');

Promise.config({
    // Enables all warnings except forgotten return statements.
    warnings: {
        wForgottenReturn: false
    }
});

const icebear = require('./peerio-icebear/src');

const { socket, config, FileStreamAbstract, systemWarnings } = icebear;

config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
socket.start();

rnFileStream(FileStreamAbstract);

module.exports = icebear;

global.icebear = icebear;
