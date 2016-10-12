import { NativeModules } from 'react-native';
import { observable, action } from 'mobx';

const touchid = observable({
    available: false,

    @action async load() {
        if (NativeModules.TouchId) {
            this.available = await NativeModules.TouchId.isFeatureAvailable();
        }
    },

    @action save(key, value) {
        return NativeModules.TouchId.saveValue(value, key);
    },

    @action get(key) {
        return NativeModules.TouchId.getValue(key);
    }
});

export default touchid;

this.Peerio = this.Peerio || {};
this.Peerio.touchid = touchid;
this.Peerio.NativeModules = this.Peerio.NativeModules || {};
this.Peerio.NativeModules.TouchId = NativeModules.TouchId;

