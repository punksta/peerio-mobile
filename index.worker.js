/* eslint-disable */
import './shim.js';
import { WorkerService } from 'rn-workers';
import { scryptForWorker, verifyDetachedForWorker, signDetachedForWorker } from './app/lib/scrypt-worker';

const worker = new WorkerService();

function healthCheck(params) {
    console.log(`index.worker.js: health check ${params}`);
    return Promise.resolve(true);
}

const fns = {
    healthCheck,
    scryptForWorker,
    verifyDetachedForWorker,
    signDetachedForWorker
};

function receive(message) {
    console.log(`index.worker.js: receiving message from ${data.fn}`);
    const data = JSON.parse(message);
    if (!fns[data.fn]) throw new Error(`index.worker.js: no such function ${data.fn}`);
    try {
        fns[data.fn](data.params)
            .then(r => send(data, r))
            .catch(() => send(data, null, `index.worker.js: error in promise ${data.fn}`));
    } catch (e) {
        send(data, null, `index.worker.js: error invoking function ${data.fn}`);
    }
}

function send(data, result, error) {
    data.result = result;
    data.error = error;
    worker.postMessage(JSON.stringify(data));
}

worker.onmessage = receive;
