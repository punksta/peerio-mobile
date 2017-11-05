import { Platform, DeviceEventEmitter, NativeModules } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import { tx } from '../utils/translator';
import { fileHelpers } from '../../lib/icebear';

const { FilePickerManager } = NativeModules;

let lastCall = null;

const launchGallery = async options => new Promise(resolve =>
    ImagePicker.launchImageLibrary(options, resolve));

const launchCamera = async options => new Promise(resolve =>
    ImagePicker.launchCamera(options, resolve));

const showFilePicker = async () => new Promise(resolve =>
    FilePickerManager.showFilePicker(null, resolve));

function waitForPermissions() {
    return new Promise(resolve => { lastCall = resolve; });
}

function normalizeUri(response) {
    const { uri } = response;
    if (Platform.OS === 'ios') {
        return uri.replace('file://', '');
    }
    return uri;
}

async function processResponse(functor) {
    let response = await functor();
    if (response.error) {
        console.log('imagepicker.js: ', response.error);
        throw new Error(response.error);
    }
    if (response.didRequestPermission) {
        console.log('imagepicker.js: permissions requested');
        await waitForPermissions();
        response = await functor();
    }
    if (!response.path && response.uri) {
        response.path = response.uri;
    }
    if (response.isAndroidCamera) {
        const ext = fileHelpers.getFileExtension(response.path);
        response.fileName = `${moment(Date.now()).format('llll')}.${ext}`;
    }
    const { fileName, path, uri } = response;
    const normalizedFileName = fileHelpers.getFileName(fileName || path || uri);
    const ext = fileHelpers.getFileExtension(normalizedFileName);
    return { url: normalizeUri(response), fileName: normalizedFileName, ext, response };
}

export default {
    launchGallery,
    showFilePicker,

    getImageFromCamera() {
        return processResponse(() => launchCamera({
            noData: true,
            storageOptions: {
                skipBackup: true,
                waitUntilSaved: true
            }
        }));
    },

    getImageFromGallery() {
        return processResponse(() => launchGallery({ noData: true }));
    },

    getImageFromAndroidFilePicker() {
        return processResponse(showFilePicker);
    }
};

// for android granting permissions
DeviceEventEmitter.addListener(`CameraPermissionsGranted`, response => {
    console.log(`imagepicker.js: permissions result: ${response}`);
    if (response && lastCall) lastCall();
});
