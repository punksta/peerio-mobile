import { observable, action, when } from 'mobx';
import TouchID from 'react-native-touch-id-value';

const touchid = observable({
    available: null,

    @action async load() {
        this.available = await TouchID.isFeatureAvailable();
        console.log(`touchid-bridge.js: ${touchid.available}`);
    },

    @action save(key, value) {
        console.log(`touchdid-bridge.js: saving ${key}:${value}`);
        return TouchID.save(key, value);
    },

    @action get(key) {
        console.log(`touchdid-bridge.js: requesting ${key}`);
        return TouchID.get(key).catch(e => {
            console.log(`touchdid-bridge.js: returned error`);
            console.log(e);
            return Promise.resolve(null);
        });
    }
});

export default touchid;
