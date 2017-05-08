import { NativeModules } from 'react-native';
import { observable } from 'mobx';
// import TouchID from 'react-native-touch-id-value';

const { RNTouchIDValue } = NativeModules;

class TouchIdBridge {
    @observable available = false;

    load = async () => {
        if (!RNTouchIDValue) return;
        this.available = await RNTouchIDValue.isFeatureAvailable();
        console.log(`touchid-bridge.js: ${this.available}`);
    }

    save(key, value) {
        console.log(`touchid-bridge.js: saving ${key}:${value.length}`);
        return RNTouchIDValue.saveValue(value, key).catch(e => {
            console.log(`touchid-bridge.js: error saving ${key}`);
            console.log(e);
        });
    }

    get(key) {
        console.log(`touchid-bridge.js: requesting ${key}`);
        return RNTouchIDValue.getValue(key).catch(e => {
            console.log(`touchdid-bridge.js: returned error from ${key}`);
            console.log(e);
            return Promise.resolve(null);
        });
    }

    delete(key) {
        console.log(`touchid-bridge.js: deleting ${key}`);
        return RNTouchIDValue.deleteValue(key).catch(e => {
            console.log(`touchdid-bridge.js: error deleting ${key}`);
            return Promise.resolve(null);
        });
    }
}

export default new TouchIdBridge();
