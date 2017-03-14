import './btoa-shim';
import rnFileStream from './rn-file-stream';
import KeyValueStorage from '../store/key-value-storage';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const icebear = require('./peerio-icebear');

const { socket, config, FileStreamAbstract } = icebear;

config.download.maxDownloadChunkSize = 1024 * 1024;
config.download.maxDecryptBufferSize = 1024 * 1024 * 2;
config.upload.encryptBufferSize = 1024 * 1024;
config.upload.uploadBufferSize = 1024 * 1024;

config.isMobile = true;
config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
config.FileStream = rnFileStream(FileStreamAbstract);
config.StorageEngine = KeyValueStorage;

config.FileStream.getCacheList()
    .then(r => {
        console.log(r);
    });

config.appVersion = '3.0.4';
config.platform = 'ios';
config.chat = {
    initialPageSize: 20, // amount of messages to load to a newly opened chat
    pageSize: 20, // when next/prev pages is requested, chat will load this amount of messages
    maxLoadedMessages: 60 // chat will remove excess of messages if paging resulted in larger count
};

socket.start();

global.icebear = icebear;
module.exports = icebear;
