import './btoa-shim';
import rnFileStream from './rn-file-stream';
import { engine } from '../store/local-storage';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const icebear = require('./peerio-icebear/src');

const { socket, config, FileStreamAbstract } = icebear;

config.upload = {
    chunkSize: 1024 * 100,
    maxReadQueue: 2, // max amount of chunks to pre-buffer for upload
    maxSendQueue: 2, // max amount of chunks to pre-encrypt for sending
    maxParallelUploadingChunks: 2 // max amount of uploaded chunks waiting for server response
};

config.isMobile = true;
config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
config.FileStream = rnFileStream(FileStreamAbstract);
config.TinyDb = engine;

socket.start();

module.exports = icebear;
global.icebear = icebear;
