import RNFS from 'react-native-fs';

const isIOS = !!RNFS.MainBundlePath;
const root = RNFS.MainBundlePath || RNFS.DocumentDirectoryPath;
const formatPath = isIOS ?
    (file) => `${root}/${file}` :
    (file) => file;

const readFile = (isIOS ? RNFS.readFile : RNFS.readFileAssets).bind(RNFS);
const existsFile = (isIOS ? RNFS.exists : RNFS.existsAssets).bind(RNFS);

module.exports = {
    loadLocaleFile(lc) {
        const def = require('peerio-copy/client_en.json');

        const path = formatPath(`locales/${lc}.json`);
        return existsFile(path)
            .then(exists => (exists ? readFile(path).then(JSON.parse) : def))
            .catch(e => {
                console.error(e);
                return def;
            });
    },

    loadDictFile(lc) {
        const path = formatPath(`dict/${lc}.txt`);
        const def = formatPath(`dict/en.txt`);
        return existsFile(path)
            .then(exists => readFile(exists ? path : def))
            .catch(e => {
                console.error(e);
                return def;
            });
    },

    loadAssetFile(name) {
        const path = formatPath(`${name}`);
        return existsFile(path)
            .then(exists => (exists ? readFile(path) : ''));
    }
};

global.RNFS = RNFS;
