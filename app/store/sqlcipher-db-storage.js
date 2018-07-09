import sqlcipher from 'react-native-sqlcipher-storage';
import { b64ToBytes, bytesToB64 } from '../lib/peerio-icebear/crypto/util';

sqlcipher.enablePromise(true);

function serialize(item) {
    if (item.payload) {
        item.payload = bytesToB64(item.payload);
    }
    if (item.props && item.props.descriptor && item.props.descriptor.payload) {
        item.props.descriptor.payload = bytesToB64(item.props.descriptor.payload);
    }
    return JSON.stringify(item);
}

function deserialize(data) {
    try {
        const item = JSON.parse(data);
        if (item.payload) {
            item.payload = b64ToBytes(item.payload);
        }
        if (item.props && item.props.descriptor && item.props.descriptor.payload) {
            item.props.descriptor.payload = b64ToBytes(item.props.descriptor.payload);
        }
        return item;
    } catch (e) {
        return null;
    }
}

class SqlCipherDbStorage {
    constructor(name) {
        this.name = `peerio_${name}`;
    }

    async open() {
        this.sql = await sqlcipher.openDatabase({ name: this.name, location: 2 });
        await this.sql.executeSql(
            'CREATE TABLE IF NOT EXISTS key_value(key TEXT PRIMARY KEY, value TEXT) WITHOUT ROWID'
        );
    }

    async getValue(key, transaction) {
        let r = null;
        const params = ['SELECT value FROM key_value WHERE key=?', [key]];
        if (transaction) {
            r = new Promise(resolve =>
                transaction.executeSql(...params, (transactionCallback, result) => {
                    resolve(result);
                }));
        } else {
            r = await this.sql.executeSql(...params);
        }
        if (!r.length || !r[0].rows.length) return undefined;
        return deserialize(r[0].rows.item(0).value);
    }

    setValue(key, value, confirmUpdate) {
        return new Promise((resolve, reject) => {
            this.sql.transaction(async transaction => {
                if (confirmUpdate) {
                    if (!confirmUpdate(await this.getValue(key, transaction), value)) {
                        reject(new Error('Cache storage caller denied update.'));
                    }
                }
                return transaction.executeSql(
                    'INSERT OR REPLACE INTO key_value(key, value) VALUES(?, ?)', [key, serialize(value)], resolve
                );
            });
        });
    }

    removeValue(key) {
        return this.sql.executeSql(
            'DELETE FROM key_value WHERE key=?', [key]
        );
    }

    async getAllKeys() {
        const result = [];
        const r = await this.sql.executeSql(
            'SELECT key FROM key_value'
        );
        if (!r.length || !r[0].rows.length) return result;
        const table = r[0].rows;
        for (let i = 0; i < table.length; ++i) {
            result.push(table.item(i).key);
        }
        return result;
    }

    async getAllValues() {
        const result = [];
        const r = await this.sql.executeSql(
            'SELECT value FROM key_value'
        );
        if (!r.length || !r[0].rows.length) return result;
        const table = r[0].rows;
        for (let i = 0; i < table.length; ++i) {
            const item = deserialize(table.item(i).value);
            if (item) result.push(item);
        }
        return result;
    }

    clear() {
        return this.sql.executeSql(
            'DELETE FROM key_value'
        );
    }
}


module.exports = SqlCipherDbStorage;
