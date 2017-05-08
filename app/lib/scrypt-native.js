import { NativeModules } from 'react-native';
import { b64ToBytes, bytesToB64 } from './worker';

function scryptNative(password, salt, options, callback) {
    const passwordB64 = bytesToB64(password);
    const saltB64 = bytesToB64(salt);
    options.p = options.p || 1;
    const { N, r, p, dkLen } = options;
    const start = (new Date()).getTime();
    return NativeModules.RNSodium.scrypt(passwordB64, saltB64, N, r, p, dkLen)
        .then(result => callback(b64ToBytes(result)))
        .then(() => console.log(`scrypt-worker.js: executed in ${(new Date()).getTime() - start}`));
}

module.exports = {
    scryptNative
};
