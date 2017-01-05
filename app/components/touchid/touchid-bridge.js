import { observable, action } from 'mobx';
import TouchID from 'react-native-touch-id-value';

const touchid = observable({
    available: false,

    @action async load() {
        this.available = await TouchID.isFeatureAvailable();
    },

    @action save(key, value) {
        return TouchID.save(value, key);
    },

    @action get(key) {
        return TouchID.get(key);
    }
});

export default touchid;

TouchID.isFeatureAvailable()
    .then(result => {
        console.log(`touchid-bridge.js: ${result}`);
    });

this.Peerio = this.Peerio || {};
this.Peerio.touchid = touchid;
