import sqlite from 'react-native-sqlcipher-storage';
import deviceInfo from 'react-native-device-info';

class SqlDb {
    system = null;

    openSystem = (name) => {
        const key = deviceInfo.getUniqueID() || 'f0905d253a79';
        return sqlite.openDatabase({ name, location: 2 /* 'nosync' */, key })
            .then(result => {
                console.log('sqldb.js - success');
                this.system = result;
                console.log(this.system);
                return this.system;
            });
    };

    checkSystemDB = () => {
        return this.system.executeSql('SELECT count(*) as valueCount FROM system_values')
            .then((res) => {
                console.log(res);
                return res; // && res.rows.length ? res.rows.item(0).valueCount : Promise.reject();
            });
    };

    wipeUserData = (username) => {
        return this.system.executeSql(
            'DELETE FROM system_values WHERE key LIKE ?',
            [`${username}_%`]);
    };

    getSystemValue = (key) => {
        return this.system.executeSql('SELECT value FROM system_values WHERE key=?', [key])
            .then((dataset) => {
                const res = dataset[0];
                return res && res.rows.length ? res.rows.item(0).value : null;
            });
    };

    setSystemValue = (key, value) => {
        return this.system.executeSql(
            'INSERT OR REPLACE INTO system_values(key, value) VALUES(?, ?)', [key, value]
        );
    };

    removeSystemValue = (key) => {
        return this.system.executeSql('DELETE FROM system_values WHERE key=?', [key]);
    };

    dropSystemTables = () => {
        return this.system.executeSql('DROP TABLE system_values')
            .catch(() => {
            });
    };

    // WARNING: Never ever change this, unless you are explicitly dropping/migrating system db in a new release
    createSystemTables = () => {
        return this.system.executeSql(
            'CREATE TABLE system_values(key TEXT PRIMARY KEY, value TEXT) WITHOUT ROWID'
        );
    };
}

sqlite.enablePromise(true);

export default SqlDb;
