import scrypt from 'scrypt-async';
import { call, b64ToBytes, bytesToB64 } from './worker';

function scryptToWorker(password, salt, options, callback) {
    const passwordB64 = bytesToB64(password);
    const saltB64 = bytesToB64(salt);
    call('scryptForWorker', { passwordB64, saltB64, options })
        .then(result => callback(b64ToBytes(result)));
}

function scryptForWorker(params) {
    const { passwordB64, saltB64 } = params;
    const password = passwordB64;
    const salt = saltB64;
    const options = params.options || {};
    options.encoding = 'base64';

    return new Promise((resolve) =>
        scrypt(password, salt, options, result => {
            resolve(result);
        })
    );
}

module.exports = { scryptForWorker, scryptToWorker };
