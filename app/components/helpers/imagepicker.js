import { Platform, DeviceEventEmitter, NativeModules } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const { FilePickerManager } = NativeModules;

let lastCall = null;

const ANDROID_PICK_ACTION = 'android-pick';

const showImagePicker = async options => new Promise(resolve =>
    ImagePicker.showImagePicker(options, resolve));

const showFilePicker = async () => new Promise(resolve =>
    FilePickerManager.showFilePicker(null, resolve));

export default {
    showImagePicker,
    showFilePicker,

    show(_customButtons, imageCallback, customCallback) {
        const customButtons = _customButtons || [];
        let chooseFromLibraryButtonTitle;
        if (Platform.OS === 'android') {
            chooseFromLibraryButtonTitle = null;
            customButtons.push({ name: ANDROID_PICK_ACTION, title: 'Choose from Library' });
        }
        const options = {
            customButtons,
            noData: true,
            chooseFromLibraryButtonTitle,
            storageOptions: {
                skipBackup: true,
                waitUntilSaved: true
            }
        };
        lastCall = async () => {
            let response = await showImagePicker(options);
            console.debug('imagepicker.js: response = ', response);
            lastCall = null;
            if (response.didCancel) {
                console.log('imagepicker.js: user cancelled image picker');
            } else if (response.error) {
                console.log('imagepicker.js: ', response.error);
            } else if (response.customButton !== ANDROID_PICK_ACTION) {
                console.debug('imagepicker.js:', response.customButton);
                customCallback(response.customButton);
            } else {
                let source = null;
                if (response.customButton === ANDROID_PICK_ACTION) response = await showFilePicker();
                if (response.isAndroidCamera) response.fileName = null;
                if (Platform.OS === 'ios') {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
                } else {
                    source = { uri: response.uri, isStatic: true };
                }
                imageCallback(source.uri, response.fileName, response);
            }
        };
        lastCall();
    }
};

// for android granting permissions
DeviceEventEmitter.addListener('CameraPermissionsGranted', () => {
    console.log('imagepicker.js: permissions granted');
    if (lastCall) lastCall();
});
