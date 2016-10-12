import RNFS from 'react-native-fs';

module.exports = {
    loadLocaleFile(lc) {
        const def = require('peerio-copy/client_en.json');
        const path = `${RNFS.MainBundlePath}/locales/${lc}.json`;
        return RNFS.exists(path)
            .then(exists => (exists ? RNFS.readFile(path).then(JSON.parse) : def))
            .catch(e => {
                console.error(e);
                return def;
            });
    },

    loadDictFile(lc) {
        const path = `${RNFS.MainBundlePath}/dict/${lc}.txt`;
        const def = `${RNFS.MainBundlePath}/dict/en.txt`;
        return RNFS.exists(path)
            .then(exists => RNFS.readFile(exists ? path : def))
            .catch(e => {
                console.error(e);
                return def;
            });
    }
};
