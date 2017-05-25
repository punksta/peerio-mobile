import { AsyncStorage } from 'react-native';

class KeyValueStorage {
    constructor(name) {
        this.prefix = `${name}:`;
    }

    _getKey(key) {
        return this.prefix + key;
    }

    // should return null if value doesn't exist
    getValue(key) {
        return AsyncStorage.getItem(this._getKey(key))
            .then(v => {
                // console.log(`key-value-storage.js: ${key}:${v}`);
                return v || null;
            })
            .catch(() => {
                // console.error(`key-value-storage.js: error reading`);
                // console.error(e);
                return null;
            });
    }

    setValue(key, value) {
        return AsyncStorage.setItem(this._getKey(key), value);
    }

    removeValue(key) {
        return AsyncStorage.removeItem(this._getKey(key));
    }

    getAllKeys() {
        return AsyncStorage.getAllKeys()
            .then(keys => {
                return keys.filter(k => k.startsWith(this.prefix)).map(k => k.replace(this.prefix, ''));
            });
    }

    clear() {
        return this.getAllKeys().then(keys => Promise.map(keys, key => this.removeValue(key)));
    }
}


export default KeyValueStorage;
