import { Platform, DeviceEventEmitter } from 'react-native';
import ImagePicker from 'react-native-image-picker';

let lastCall = null;

export default {
    show(customButtons, imageCallback, customCallback) {
        const options = {
            customButtons,
            noData: true,
            storageOptions: {
                skipBackup: true,
                waitUntilSaved: true
            }
        };
        lastCall = () => ImagePicker.showImagePicker(options, (response) => {
            console.log('imagepicker.js: response = ', response);
            lastCall = null;
            if (response.didCancel) {
                console.log('imagepicker.js: user cancelled image picker');
            } else if (response.error) {
                console.log('imagepicker.js: ', response.error);
            } else if (response.customButton) {
                console.log('imagepicker.js:', response.customButton);
                customCallback(response.customButton);
            } else {
                let source = null;
                if (Platform.OS === 'ios') {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
                } else {
                    source = { uri: response.uri, isStatic: true };
                }
                imageCallback(source.uri, response.fileName, response);
            }
        });
        lastCall();
    }
};

// for android granting permissions
DeviceEventEmitter.addListener('CameraPermissionsGranted', () => {
    console.log('imagepicker.js: permissions granted');
    if (lastCall) lastCall();
});
