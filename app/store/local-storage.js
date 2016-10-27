import { AsyncStorage } from 'react-native';
import { setEngine, db } from '../lib/icebear';

const engine = {
    getValue(name) {
        return AsyncStorage.getItem(name).then(JSON.parse);
    },

    setValue(name, value) {
        return AsyncStorage.setItem(name, JSON.stringify(value));
    }
};

setEngine(engine);

export default db;
