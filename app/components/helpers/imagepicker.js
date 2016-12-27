import { Platform } from 'react-native';
import { reaction, when } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import { socket, fileStore } from '../../lib/icebear';

const options = {
    noData: 'true',
    storageOptions: {
        skipBackup: true,
        waitUntilSaved: true
    }
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
                // console.log('imagepicker.js: ', source);
                when(() => socket.authenticated,
                     () => fileStore.upload(source.uri, response.fileName));
                // console.log(`imagepicker.js: id ${file.id}`);
                // console.log(`imagepicker.js: fileId ${file.fileId}`);
                // global.currentFile = file;
                // reaction(() => file.progress, progress => {
                //     console.log(`imagepicker.js: progress ${progress}`);
                // });

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
