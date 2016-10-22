import RNFS from 'react-native-fs';

const root = RNFS.MainBundlePath || `${RNFS.DocumentDirectoryPath}/assets`;

module.exports = {
    loadLocaleFile(lc) {
        const def = require('peerio-copy/client_en.json');
        const path = `${root}/locales/${lc}.json`;
        return RNFS.exists(path)
            .then(exists => (exists ? RNFS.readFile(path).then(JSON.parse) : def))
            .catch(e => {
                console.error(e);
                return def;
            });
    },

    loadDictFile(lc) {
        const path = `${root}/dict/${lc}.txt`;
        const def = `${root}/dict/en.txt`;
        return RNFS.exists(path)
            .then(exists => RNFS.readFile(exists ? path : def))
            .catch(e => {
                console.error(e);
                return def;
            });
    }
};
