import RNFS from 'react-native-fs';
import RNFetchBlob from 'peerio-react-native-fetch-blob';
import FileOpener from 'react-native-file-opener';
import { fromByteArray, toByteArray } from 'base64-js';

module.exports = (fileStream) => {
    class RNFileStream extends fileStream {
        constructor(filePath, mode, bufferSize) {
            super(filePath, mode, bufferSize);
            // private buffer based on same chunk of RAM (ArrayBuffer) as public buffer
            if (this.buffer) this._buffer = Buffer.from(this.buffer.buffer);
        }

        open() {
            if (this.mode === 'read') {
                return RNFS.readFile(this.filePath, 'base64')
                    .then((contents) => {
                        this.fileDescriptor = { mock: this.filePath, position: 0 };
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                this.contents = Buffer.from(toByteArray(contents));
                                const size = this.contents.byteLength;
                                this.fileDescriptor.size = size;
                                console.log(`imagepicker.js: file size ${size}`);
                                return resolve(size);
                            });
                        });
                    });
            }
            // this.contents = ''; // this.fileDescriptor = 1; // return Promise.resolve();
            return RNFetchBlob.fs.writeStream(this.filePath, 'base64', false)
                .then(fd => {
                    this.fileDescriptor = fd;
                    this.contents = 0;
                    // resolve with filesize
                    return 0;
                });
        }

        close() {
            if (this.fileDescriptor == null) return Promise.resolve();
            if (this.mode === 'read') {
                this.fileDescriptor = null;
                this.contents = null;
                console.log('imagepicker.js successfully read: ', this.filePath);
                return Promise.resolve();
            }
            return this.fileDescriptor.close()
                .then(() => {
                    console.log('imagepicker.js successfully written: ', this.filePath);
                    this.contents = null;
                    this.fileDescriptor = null;
                });
        }

        /**
         *
         * @return {Promise<number>}
         */
        readInternal() {
            const fd = this.fileDescriptor;
            const chunkSize = this._buffer.byteLength;
            const sourceSize = fd.size;
            const count = Math.min(chunkSize, sourceSize - fd.position);
            console.log(`imagepicker.js: chunkSize ${chunkSize}, position ${fd.position}, sent ${count}`);
            if (count < 0) {
                console.error('imagepicker.js: error reading next chunk. count is less than zero');
            }
            const copiedCount = this.contents.copy(this._buffer, 0, fd.position, fd.position + count);
            if (count !== copiedCount) {
                console.error('imagepicker.js: error reading next chunk. count is not equal to copied count');
            }
            fd.position += count;
            return Promise.resolve(count);
        }

        /**
         * @param {Uint8Array} buffer
         * @return {Promise}
         */
        writeInternal(buffer) {
            this.contents += buffer.byteLength;
            console.log('imagepicker.js: next block', this.contents);
            return this.fileDescriptor.write(fromByteArray(buffer));
        }

        static useCache = true

        static cachePath(name) {
            return `${RNFS.CachesDirectoryPath}/${name}`;
        }

        static exists(path) {
            return RNFS.exists(path);
        }

        /**
         * Launch external viewer
         */
        static launchViewer(path) {
            FileOpener.open(path, 'image/jpeg');
        }

    }

    fileStream.FileStream = RNFileStream;
};
