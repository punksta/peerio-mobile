import RNFS from 'react-native-fs';

module.exports = {
    loadLocaleFile(lc) {
        const def = require('peerio-copy/client_en.json');
        const path = RNFS.MainBundlePath + '/locales/' + lc + '.json';
        return RNFS.exists(path)
            .then(exists => {
                return exists ? RNFS.readFile(path).then(JSON.parse) : def;
            })
            .catch(e => {
                console.error(e);
                return def;
            });
    }
};
