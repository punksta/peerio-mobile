import { setUrlMap, setTagHandler } from 'peerio-translator';
import tagHandlers from '../components/controls/tag-handlers';
import rnFileStream from './rn-file-stream';
import KeyValueStorage from '../store/key-value-storage';

export default (c, icebear) => {
    const cfg = c;
    cfg.ghostFrontendUrl = 'https://mail.peerio.com';
    // --- TRANSLATOR
    cfg.translator = {};
    cfg.translator.stringReplacements = []; // white label only
    cfg.translator.urlMap = {
        fingerprint: 'https://peerio.zendesk.com/hc/en-us/articles/204394135',
        mpDetail: 'https://peerio.zendesk.com/hc/en-us/articles/214633103-What-is-a-Peerio-Master-Password-',
        tfaDetail: 'https://peerio.zendesk.com/hc/en-us/articles/203665635-What-is-two-factor-authentication-',
        msgSignature: 'https://peerio.zendesk.com/hc/en-us/articles/204394135',
        upgrade: 'https://www.peerio.com/pricing.html',
        proWelcome: 'https://peerio.zendesk.com/hc/en-us/articles/208395556',
        proAccount: 'https://account.peerio.com',
        helpCenter: 'https://peerio.zendesk.com/',
        contactSupport: 'https://peerio.zendesk.com/hc/en-us/requests/new'
    };

    setUrlMap(cfg.translator.urlMap);
    for (const name in tagHandlers) {
        setTagHandler(name, tagHandlers[name]);
    }

    cfg.download.maxDownloadChunkSize = 1024 * 1024;
    cfg.download.maxDecryptBufferSize = 1024 * 1024 * 2;
    cfg.upload.encryptBufferSize = 1024 * 1024;
    cfg.upload.uploadBufferSize = 1024 * 1024;

    cfg.isMobile = true;
    cfg.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://icebear.peerio.com';
    cfg.FileStream = rnFileStream(icebear.FileStreamAbstract);
    cfg.StorageEngine = KeyValueStorage;

    cfg.FileStream.getCacheList()
        .then(r => {
            console.log(r);
        });

    cfg.appVersion = require('../../package.json').version;
    cfg.platform = 'ios';
    cfg.chat = {
        maxInitialChats: 10,
        initialPageSize: 20, // amount of messages to load to a newly opened chat
        pageSize: 20, // when next/prev pages is requested, chat will load this amount of messages
        maxLoadedMessages: 40, // chat will remove excess of messages if paging resulted in larger count
        decryptQueueThrottle: 10 // ms, delay between proccessing messages in a batch
    };
};
