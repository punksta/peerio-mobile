import { NativeModules } from 'react-native';
import { observable } from 'mobx';

const { RNKeychain } = NativeModules;

class TouchIdBridge {
    get hasPlugin() { return !!RNKeychain; }
    @observable available = false;

    load = async () => {
        if (!RNKeychain) return;
        this.available = await RNKeychain.isFeatureAvailable();
        console.log(`keychain-bridge.js: ${this.available}`);
    }

    save(key, value, secureWithTouchID) {
        console.log(`keychain-bridge.js: saving ${key}:${value.length}`);
        return RNKeychain.saveValue(value, key, secureWithTouchID).catch(e => {
            console.log(`keychain-bridge.js: error saving ${key}`);
            console.log(e);
        });
    }

    get(key) {
        console.log(`keychain-bridge.js: requesting ${key}`);
        return RNKeychain.getValue(key).catch(e => {
            console.log(`keychain-bridge.js: returned error from ${key}`);
            console.log(e);
            return Promise.resolve(null);
        });
    }

    delete(key) {
        console.log(`keychain-bridge.js: deleting ${key}`);
        return RNKeychain.deleteValue(key).catch(e => {
            console.log(`touchdid-bridge.js: error deleting ${key}`);
            return Promise.resolve(null);
        });
    }
}

export default new TouchIdBridge();
