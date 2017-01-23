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
        return AsyncStorage.getItem(this._getKey(key));
    }

    setValue(key, value) {
        return AsyncStorage.getItem(this._getKey(key), value);
    }

    removeValue(key) {
        return AsyncStorage.removeItem(this._getKey(key));
    }

    getAllKeys() {
        return AsyncStorage.getAllKeys()
            .then(keys => {
                return keys.map(k => k.replace(this.prefix, ''));
            });
    }
}

export default KeyValueStorage;
