import is from 'is-js';
import SqlDb from './sqldb';

const serializeObject = obj =>
    ((is.object(obj) && Object.keys(obj).length === 0) ? null : JSON.stringify(obj));

const encodeBase64 = () => null;
const decodeBase64 = () => null;
const secretBoxEncrypt = () => null;
const secretBoxDecrypt = () => null;

// tinyDB key for last logged in user
const lastLoginKey = 'lastLogin';
// tinyDB postfix for user-stored pins
const userSetPin = 'PIN';
// tinyDB postfix for user-stored pins
const systemSetPin = 'systemPIN';

class TinyDb extends SqlDb {
    /**
     * Saves any value to storage.
     * Value will be serialized to json string
     * @param {string} key - unique key. Existing value with the same key will be overwritten.
     * @param {Object|string|number|boolean|null} value
     * @param {string} [keyPrefix] - for scoped values specify
     * this argument and it will be automatically added to the key
     * @param {Uint8Array} [encryptionKey] - if specified, will be used to encrypt saved value
     * @promise
     */
    saveItem = (keyParam, valueParam, keyPrefix, encryptionKey) => {
        const key = this.getKey(keyParam, keyPrefix);
        const value = serializeObject(valueParam);
        if (!encryptionKey) return this.setSystemValue(key, value);
        return secretBoxEncrypt(value, encryptionKey)
            .then(encrypted => {
                encrypted.ciphertext = encodeBase64(encrypted.ciphertext);
                encrypted.nonce = encodeBase64(encrypted.nonce);
                return this.setSystemValue(key, JSON.stringify(encrypted));
            });
    };

    /**
     * Retrieves value by key.
     * Value will be JSON parsed before returning.
     * @params {string} key - unique key
     * @param {string} [keyPrefix] - for scoped values specify this argument and it will be automatically added to the key
     * @param {Uint8Array} [decryptionKey] - if specified, will be used to decrypt saved value
     * @promise {Object|string|number|boolean|null} value
     */
    getItem = (key, keyPrefix, decryptionKey) => {
        return this.getSystemValue(this.getKey(key, keyPrefix))
            .then(result => {
                const value = JSON.parse(result);
                if (!decryptionKey || value == null) return value;
                value.ciphertext = decodeBase64(value.ciphertext);
                value.nonce = decodeBase64(value.nonce);

                return secretBoxDecrypt(value.ciphertext, value.nonce, decryptionKey)
                    .then(decrypted => JSON.parse(decrypted));
            });
    };

    getKey(key, prefix) {
        return prefix && prefix !== '' ? `${prefix}_${key}` : key;
    }

    /**
     * Retrieves saved login (last successful one)
     * @promise {null|{username, firstName}}
     */
    getSavedLogin = () => {
        return this.getItem(lastLoginKey);
    };

    // get pin encrypted keys from system storage
    getPinForUser = (username, isSystemPin) => {
        return this.getItem(isSystemPin ? systemSetPin : userSetPin, username);
    };
}

const tinydb = new TinyDb();
export default tinydb;
