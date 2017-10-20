import { Platform, DeviceEventEmitter, NativeModules } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import { tx } from '../utils/translator';
import { fileHelpers } from '../../lib/icebear';

const { FilePickerManager } = NativeModules;

let lastCall = null;

const ANDROID_PICK_ACTION = 'android-pick';

const showImagePicker = async options => new Promise(resolve =>
    ImagePicker.showImagePicker(options, resolve));

const launchCamera = async options => new Promise(resolve =>
    ImagePicker.launchCamera(options, resolve));

const showFilePicker = async () => new Promise(resolve =>
    FilePickerManager.showFilePicker(null, resolve));

function normalizeUri(response) {
    const { uri } = response;
    if (Platform.OS === 'ios') {
        return uri.replace('file://', '');
    }
    return uri;
}

function processResponse(response, imageCallback) {
    if (response.isAndroidCamera) {
        const ext = fileHelpers.getFileExtension(response.path);
        response.fileName = `${moment(Date.now()).format('llll')}.${ext}`;
    }
    imageCallback(normalizeUri(response), response.fileName, response);
}

export default {
    showImagePicker,
    showFilePicker,

    async show(_customButtons, imageCallback, customCallback) {
        const customButtons = _customButtons || [];
        const options = {
            customButtons,
            noData: true,
            storageOptions: {
                skipBackup: true,
                waitUntilSaved: true
            }
        };

        if (Platform.OS === 'android') {
            options.customButtons.push({ name: ANDROID_PICK_ACTION, title: tx('button_pickFromLibrary') });
            options.chooseFromLibraryButtonTitle = null;
        }

        let response = await showImagePicker(options);
        console.log(`imagepicker.js: got response`);
        console.debug(response);
        // user selected camera and needs to confirm permissions
        // TODO: check for iOS
        if (response.didRequestPermission && response.option === 'launchCamera') {
            console.log('imagepicker.js: requested permission');
            lastCall = async () => processResponse(await launchCamera(options), imageCallback);
        // user cancelled
        } else if (response.didCancel) {
            console.log('imagepicker.js: user cancelled image picker');
        // user error
        } else if (response.error) {
            console.log('imagepicker.js: ', response.error);
        // user selected custom button in the action sheet
        } else if (customCallback && response.customButton && response.customButton !== ANDROID_PICK_ACTION) {
            console.log('imagepicker.js:', response.customButton);
            customCallback(response.customButton);
        // user is on Android and uses custom file picker therefore
        } else if (response.customButton === ANDROID_PICK_ACTION) {
            lastCall = async () => {
                response = await showFilePicker();
                if (response.didRequestPermission) return;
                lastCall = null;
                imageCallback(normalizeUri(response), response.fileName, response);
            };
            lastCall();
        // user selected camera or gallery and permissions are intact
        } else if (response.path) {
            processResponse(response, imageCallback);
        } else {
            console.log(`imagepicker.js: path is empty`);
        }
    }
};

// for android granting permissions
DeviceEventEmitter.addListener(`CameraPermissionsGranted`, response => {
    console.log(`imagepicker.js: permissions result: ${response}`);
    if (response && lastCall) lastCall();
});
