import BLAKE2s from 'blake2s-js';
import scrypt from 'scrypt-async';
import nacl from 'tweetnacl';
import tinydb from './tinydb';
import { crypto } from '../icebear';

const { cryptoUtil } = crypto;

function decodeUTF8(s) {
    let i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
}

function encodeUTF8(arr) {
    let i, s = [];
    for (i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
    return decodeURIComponent(escape(s.join('')));
};


const keySize = 32;
const scryptResourceCost = 14;
const scryptBlockSize = 8;
const scryptStepDuration = 1000;

class Migrator {
    /**
     * Derive actual encryption key from a PIN using scrypt and BLAKE2s.
     * Key is used to encrypt long-term passphrase locally.
     * @param {string} PIN
     * @param {string} username
     * @promise {Uint8Array}
     */
    getKeyFromPIN = (PIN, username) => {
        return new Promise((resolve) => {
            const hash = new BLAKE2s(keySize);
            hash.update(decodeUTF8(PIN));
            scrypt(hash.hexDigest(), decodeUTF8(username), scryptResourceCost, scryptBlockSize, keySize, scryptStepDuration, resolve);
        }).then((keyBytes) => {
            console.log(keyBytes);
            return new Uint8Array(keyBytes);
        });
    };

    secretBoxDecrypt = (ciphertextParam, nonce, key) => {
        let ciphertext = ciphertextParam;
        if (typeof ciphertext === 'string') ciphertext = decodeUTF8(ciphertext);
        return Promise.resolve(encodeUTF8(nacl.secretbox.open(ciphertext, nonce, key)));
    };

    run = () => {
        tinydb.openSystem('_peerio_system')
            .then(() => this.checkSystem())
            .then(() => tinydb.getSavedLogin())
            .then(data => {
                console.log('tinydb.js: last login data');
                console.log(data);
                return data.username;
            })
            .then(username => {
                console.log(`tinydb.js: get username ${username}`);
                console.log('tinydb.js: deriving key');
                const pin = '123123';
                return this.getKeyFromPIN(pin, username)
                    .then(pinKey => {
                        console.log(pinKey);
                        return tinydb.getPinForUser(username)
                            .then(pinData => {
                                console.log('tinydb.js: pin data');
                                console.log(pinData);
                                const ciphertext = cryptoUtil.b64ToBytes(pinData.ciphertext);
                                console.log(ciphertext);
                                const nonce = cryptoUtil.b64ToBytes(pinData.nonce);
                                console.log(nonce);
                                return this.secretBoxDecrypt(ciphertext, nonce, pinKey)
                                    .then(keys => {
                                        console.log(`migrator.js: keys decrypted`);
                                        console.log(JSON.stringify(keys));
                                    });
                            });
                    });
            });
    }

    checkSystem = () => tinydb.checkSystemDB()
        .then(r => {
            console.log(`migrator.js: check run successfully: ${r}`);
        });
}

const migrator = new Migrator();

export default migrator;
