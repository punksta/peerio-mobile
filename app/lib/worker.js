import { Worker } from 'rn-workers';
import { b64ToBytes, bytesToB64 } from './peerio-icebear/crypto/util';

let worker = null;
let messageIndex = 0;
const handlers = {};
const maxMessageIndex = Number.MAX_SAFE_INTEGER / 2;
const callTimeout = 50000;

function call(fn, params) {
    if (worker === null) throw new Error('worker.js: worker is not initialized');
    // increase message index
    if (messageIndex > maxMessageIndex) messageIndex = 0;
    messageIndex++;
    const message = {
        messageIndex,
        fn,
        params
    };
    const data = JSON.stringify(message);
    // console.log(`worker.js[${message.messageIndex}]: sending ${fn}`);
    // console.log(data);
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), callTimeout);
        handlers[messageIndex] = { resolve, timeout };
        worker.postMessage(data);
    });
}

function receive(data) {
    if (data === undefined) throw new Error('worker.js: undefined received from worker');
    // console.log(data);
    const message = JSON.parse(data);
    // console.log(`worker.js[${message.messageIndex}]: receiving ${message.fn}`);
    const h = handlers[message.messageIndex];
    if (!h) throw new Error('worker.js: could not find correrspondent handler');
    const { resolve, timeout } = handlers[message.messageIndex];
    clearTimeout(timeout);
    resolve(message.result);
    delete handlers[message.messageIndex];
}

function init() {
    worker = new Worker();
    worker.onmessage = receive;
    return call('healthCheck', { data: true })
        .then(r => console.log(`worker.js: health check successful: ${r}`));
}

module.exports = { init, call, b64ToBytes, bytesToB64 };
