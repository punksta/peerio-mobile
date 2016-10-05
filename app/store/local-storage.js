import { AsyncStorage } from 'react-native';

// const store = new Proxy(original, {
//     get(target, name) {
//         if (!(name in target)) {
//             console.log(`Getting non-existant property '${name}'`);
//             return undefined;
//         }
//         return target[name];
//     },
//     set(target, name, value) {
//         if (!(name in target)) {
//             console.log(`Setting non-existant property '${name}, ${value}'`);
//         }
//         target[name] = value;
//         return true;
//     }
// });
// const store = observable(asMap(original));
const store = {};

// observe(store, (change) => {
//     console.log(change.type, change.name, 'from', change.oldValue, 'to', change.object[change.name]);
// });

store.get = async function(name) {
    const value = await AsyncStorage.getItem(name);
    return JSON.parse(value);
};

store.set = async function(name, value) {
    await AsyncStorage.setItem(name, JSON.stringify(value));
};

class PrefixStore {
    constructor(prefix) {
        this.prefix = prefix;
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
    }

    async set(name, value) {
        await store.set(`${this.prefix}::${name}`, value);
    }

    async get(name) {
        return await store.set(`${this.prefix}::${name}`);
    }
}

store.global = new PrefixStore('global');

store.setUserDB = (username) => {
    store.user = new PrefixStore(username);
};

export default store;
