import rnFileStream from './rn-file-stream';
import KeyValueStorage from '../store/key-value-storage';

export default (c, icebear) => {
    const config = c;
    config.download.maxDownloadChunkSize = 1024 * 1024;
    config.download.maxDecryptBufferSize = 1024 * 1024 * 2;
    config.upload.encryptBufferSize = 1024 * 1024;
    config.upload.uploadBufferSize = 1024 * 1024;

    config.isMobile = true;
    config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
    config.FileStream = rnFileStream(icebear.FileStreamAbstract);
    config.StorageEngine = KeyValueStorage;

    config.FileStream.getCacheList()
        .then(r => {
            console.log(r);
        });

    config.appVersion = '3.0.4';
    config.platform = 'ios';
    config.chat = {
        initialPageSize: 20, // amount of messages to load to a newly opened chat
        pageSize: 10, // when next/prev pages is requested, chat will load this amount of messages
        maxLoadedMessages: 40 // chat will remove excess of messages if paging resulted in larger count
    };
};
