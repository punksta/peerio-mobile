import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { fromByteArray, toByteArray } from 'base64-js';
import { FileStreamAbstract, fileStore } from '../../lib/icebear';

class FileStream extends FileStreamAbstract {
    constructor(filePath, mode, bufferSize) {
        super(filePath, mode, bufferSize);
        // fs works with Buffer instances so we create
        // private buffer based on same chunk of RAM (ArrayBuffer) as public buffer
        if (this.buffer) this._buffer = Buffer.from(this.buffer.buffer);
    }

    open() {
        if (this.mode === 'read') {
            // const size = 500000;
            // const fd = { size, mock: this.filePath, position: 0 };
            // this.fileDescriptor = fd;
            // return Promise.resolve(size);

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
                // resolve with filesize
                return 0;
            });
    }

    close() {
        if (this.fileDescriptor == null) return Promise.resolve();
        // console.log('imagepicker.js: ');
        // console.log(this.contents);
        this.fileDescriptor = null;
        this.contents = null;
        return Promise.resolve();

        // return RNFS.writeFile(this.filePath, this.contents, 'base64')
        //     .then(() => {
        //         this.contents = null;
        //         this.fileDescriptor = null;
        //     });
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
        // return new Promise((resolve, reject) => {
        //     fs.read(this.fileDescriptor, this._buffer, 0, this._buffer.byteLength, null,
        //         (err, bytesRead) => {
        //             if (this.checkForError(err, reject)) return;
        //             resolve(bytesRead);
        //         });
        // });
    }

    /**
     * @param {Uint8Array} buffer
     * @return {Promise}
     */
    writeInternal(buffer) {
        return this.fileDescriptor.write(fromByteArray(buffer));
        // console.log('imagepicker.js: ', buffer.length);
        // this.contents += fromByteArray(buffer);
        // return Promise.resolve();
    }
}

FileStreamAbstract.FileStream = FileStream;

const options = {
    noData: 'true'
    // storageOptions: {
    //     skipBackup: true,
    //     path: 'images'
    // }
};

export default {
    test() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = null;
                if (Platform.OS === 'ios') {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
                } else {
                    source = { uri: response.uri, isStatic: true };
                }
                console.log('imagepicker.js: ', source);
                fileStore.upload(source.uri);

                // RNFetchBlob.fs.readStream(source.uri, 'base64', 4095)
                //     .then((ifstream) => {
                //         console.log(ifstream);
                //         // ifstream.open();
                //         // ifstream.onData((chunk) => {
                //         //     console.log('imagepicker.js: another chunk - ', chunk);
                //         //     const a = toByteArray(chunk);
                //         //     console.log(a);
                //         // });
                //         // ifstream.onError((err) => {
                //         //     console.log('imagepicker.js: ', err);
                //         // });
                //         // ifstream.onEnd(() => {});
                //     });
            }
        });
    }
};
