import { Platform, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import pathUtils from 'path';

const icebear = require('./peerio-icebear');

const { bytesToB64, b64ToBytes } = icebear.crypto.cryptoUtil;

const ROOT = Platform.OS === 'ios' ? RNFS.CachesDirectoryPath : RNFS.ExternalDirectoryPath;

export default (fileStream) => {
    class RNFileStream extends fileStream {

        open() {
            if (this.mode === 'read') {
                this.fileDescriptor = this.filePath; // read stream doesn't really have descriptor
                return RNFS.stat(this.filePath)
                    .then(s => {
                        this.size = s.size;
                        return this;
                    });
            }
            RNFS.mkdir(pathUtils.dirname(this.filePath));
            this.fileDescriptor = this.filePath;
            return Promise.resolve(this);
        }

        close() {
            if (this.fileDescriptor == null) return Promise.resolve();
            this.fileDescriptor = null;
            console.debug(`rn-file-stream.js successfully ${this.mode}: ${this.filePath}`);
            return Promise.resolve();
        }

        /**
         *
         * @return {Promise<number>}
         */
        readInternal(size) {
            return RNFS.readFileChunk(this.filePath, this.pos, size)
                        .then(contents => b64ToBytes(contents));
        }

        /**
         * Move file position pointer
         * @param {number} pos
         */
        seekInternal(pos) {
            this.pos = pos;
            const fd = this.fileDescriptor;
            if (fd) {
                fd.position = pos;
                return fd.position;
            }
            throw new Error('rn-file-stream.js: stream is not initialized');
        }

        /**
         * @param {Uint8Array} buffer
         * @return {Promise}
         */
        writeInternal(buffer) {
            return RNFS.appendFile(this.fileDescriptor, bytesToB64(buffer), 'base64').return(buffer);
        }

        static getFullPath(uid, name) {
            return `${ROOT}/${uid}/${name}`;
        }

        static exists(path) {
            return RNFS.exists(path);
        }

        /**
         * Launch external viewer
         */
        static launchViewer(path) {
            console.debug(`rn-file-stream.js: opening viewer for ${path}`);
            return FileOpener.open(path, 'image/jpeg');
        }

        static getStat(path) {
            return RNFS.stat(path);
        }

        /**
         * @returns {Promise<string[]>}
         */
        static getCacheList() {
            return RNFS.readDir(ROOT)
                .then(items => {
                    return items.filter(i => i.isFile()).map(i => i.path);
                });
        }

        static delete(path) {
            return RNFS.unlink(path);
        }

    }

    return RNFileStream;
};


/**
 * Get encryption status of the filesystem
 * For iOS we assume it's always active
 * For Android:
 * @return {int} 0 - inactive, 1 - active with default pin, 2 - active
 */
function getEncryptionStatus() {
    const api = NativeModules.RNFSManager.getEncryptionStatus;
    if (!api) return Promise.resolve(2); // we are on iOS
    return api();
}

getEncryptionStatus().then(status => {
    console.log(`rn-file-stream.js: encryption ${status}`);
    global.fileEncryptionStatus = status;
});
