import sqlcipher from 'react-native-sqlcipher-storage';

sqlcipher.enablePromise(true);

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

    async getValue(key) {
        const r = await this.sql.executeSql(
            'SELECT value FROM key_value WHERE key=?', [key]
        );
        if (!r.length || !r[0].rows.length) return undefined;
        return JSON.parse(r[0].rows.item(0).value);
    }

    setValueInternal(key, value) {
        return this.sql.executeSql(
            'INSERT OR REPLACE INTO key_value(key, value) VALUES(?, ?)', [key, value]
        );
    }

    async setValue(key, value, confirmUpdate) {
        if (confirmUpdate) {
            if (!confirmUpdate(await this.getValue(key), value)) {
                throw new Error('Cache storage caller denied update.');
            }
        }
        return this.setValueInternal(JSON.stringify(key), JSON.stringify(value));
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
            result.push(JSON.parse(table.item(i).key));
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
            result.push(JSON.parse(table.item(i).value));
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
