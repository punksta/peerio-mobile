import scrypt from 'scrypt-async';
import nacl from 'tweetnacl';
import { call, b64ToBytes, bytesToB64 } from './worker';

function scryptToWorker(password, salt, options, callback) {
    const passwordB64 = bytesToB64(password);
    const saltB64 = bytesToB64(salt);
    call('scryptForWorker', { passwordB64, saltB64, options })
        .then(result => callback(b64ToBytes(result)));
}

function scryptForWorker(params) {
    const { passwordB64, saltB64 } = params;
    const password = b64ToBytes(passwordB64);
    const salt = b64ToBytes(saltB64);
    const options = params.options || {};
    options.encoding = 'base64';
    options.interruptStep = 0;

    return new Promise((resolve) =>
        scrypt(password, salt, options, result => {
            resolve(result);
        })
    );
}

/**
 * Signs the message with secret key and returns detached signature
 * @param {Uint8Array} message
 * @param {Uint8Array} secretKey
 * @returns {Promise<Uint8Array>} signature
 */
function signDetachedToWorker(message, secretKey) {
    const messageB64 = bytesToB64(message);
    const secretKeyB64 = bytesToB64(secretKey);
    return call('signDetachedForWorker', { messageB64, secretKeyB64 })
        .then(b64ToBytes);
}

/**
 * Signs the message with secret key and returns detached signature
 */
function signDetachedForWorker(params) {
    const { messageB64, secretKeyB64 } = params;
    const message = b64ToBytes(messageB64);
    const secretKey = b64ToBytes(secretKeyB64);
    return Promise.resolve(bytesToB64(nacl.sign.detached(message, secretKey)));
}

function verifyDetachedToWorker(message, signature, publicKey) {
    const messageB64 = bytesToB64(message);
    const signatureB64 = bytesToB64(signature);
    const publicKeyB64 = bytesToB64(publicKey);
    return call('verifyDetachedForWorker', { messageB64, signatureB64, publicKeyB64 });
}

function verifyDetachedForWorker(params) {
    let result = false;
    const { messageB64, signatureB64, publicKeyB64 } = params;
    const message = b64ToBytes(messageB64);
    const signature = b64ToBytes(signatureB64);
    const publicKey = b64ToBytes(publicKeyB64);
    try {
        result = nacl.sign.detached.verify(message, signature, publicKey);
    } catch (err) {
        console.error(err);
    }
    return Promise.resolve(result);
}

module.exports = {
    scryptForWorker,
    scryptToWorker,
    verifyDetachedForWorker,
    verifyDetachedToWorker,
    signDetachedForWorker,
    signDetachedToWorker
};
