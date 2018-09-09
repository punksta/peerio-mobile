import sqlcipher from 'react-native-sqlcipher-storage';
import { b64ToBytes, bytesToB64 } from '../lib/peerio-icebear/crypto/util';
import CacheEngineBase from '../lib/peerio-icebear/db/cache-engine-base';

sqlcipher.enablePromise(false);

function isBytes(value) {
    return value && (value instanceof Uint8Array || value instanceof ArrayBuffer)
}

function payloadToBase64(key, value) {
    return (key === 'payload' && isBytes(value)) ? bytesToB64(value) : value
}

function payloadFromBase64(key, value) {
    return (key === 'payload' && typeof value === "string") ? b64ToBytes(value) : value
}

function serialize(item) {
    return JSON.stringify(item, payloadToBase64);
}

function deserialize(data) {
    try {
        return JSON.parse(data, payloadFromBase64);
    } catch (e) {
        return null;
    }
}

const LOCATION_CONFIG = 2;

class SqlCipherDbStorage extends CacheEngineBase {
    async openInternal() {
        console.log(`open db: ${this.name}`);
        this.sql = await sqlcipher.openDatabase({ name: this.name, location: LOCATION_CONFIG });
        this.sql.executeSqlPromise = (sql, params) => new Promise(resolve => {
            this.sql.executeSql(sql, params, resolve);
        });
        await this.sql.executeSqlPromise(
            'CREATE TABLE IF NOT EXISTS key_value(key TEXT PRIMARY KEY, value TEXT) WITHOUT ROWID'
        );
    }

    async getValue(key) {
        let r = null;
        r = await this.sql.executeSqlPromise('SELECT value FROM key_value WHERE key=?', [key]);
        if (!r || !r.rows.length) return undefined;
        r = deserialize(r.rows.item(0).value);
        return r;
    }

    transactionInsert(transaction, key, value) {
        return new Promise(resolve => transaction.executeSql(
            'INSERT OR REPLACE INTO key_value(key, value) VALUES(?, ?)',
            [key, serialize(value)],
            resolve
        ));
    }

    setValue(key, value, confirmUpdate) {
        return new Promise((resolve, reject) => {
            this.sql.transaction(transaction => {
                if (!confirmUpdate) {
                    resolve(this.transactionInsert(transaction, key, value));
                    return;
                }
                transaction.executeSql(
                    'SELECT value FROM key_value WHERE key=?',
                    [key],
                    (tx, result) => {
                        const oldValue = result && result.rows.length ? deserialize(result.rows.item(0).value) : undefined;
                        const confirmed = confirmUpdate(oldValue, value);
                        if (!confirmed) {
                            reject(new Error('Cache storage caller denied update.'));
                        } else {
                            resolve(this.transactionInsert(tx, key, confirmed));
                        }
                    }
                );
            });
        });
    }

    removeValue(key) {
        return this.sql.executeSqlPromise(
            'DELETE FROM key_value WHERE key=?', [key]
        );
    }

    async getAllKeys() {
        const result = [];
        const r = await this.sql.executeSqlPromise(
            'SELECT key FROM key_value'
        );
        if (!r || !r.rows) return result;
        for (let i = 0; i < r.rows.length; ++i) {
            result.push(r.rows.item(i).key);
        }
        return result;
    }

    async getAllValues() {
        const result = [];
        const r = await this.sql.executeSqlPromise(
            'SELECT value FROM key_value'
        );
        if (!r || !r.rows) return result;
        for (let i = 0; i < r.rows.length; ++i) {
            result.push(deserialize(r.rows.item(i).value));
        }
        return result;
    }

    clear() {
        return this.sql.executeSqlPromise(
            'DELETE FROM key_value'
        );
    }

    async deleteDatabase(name) {
        console.log(`deleting db ${name}`);
        return new Promise(
            (resolve, reject) => sqlcipher.deleteDatabase(
                { name, location: LOCATION_CONFIG },
                resolve, reject));
    }
}


module.exports = SqlCipherDbStorage;
