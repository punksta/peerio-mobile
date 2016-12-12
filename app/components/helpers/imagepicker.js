import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { fileStore } from '../../lib/icebear';

const options = {
    noData: 'true',
    storageOptions: {
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
