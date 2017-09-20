import React from 'react';
import { observer } from 'mobx-react/native';
import RNFS from 'react-native-fs';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
// import FileOpener from 'react-native-file-opener';
import SafeComponent from '../shared/safe-component';
import { User, crypto } from '../../lib/icebear';
import { tx } from '../utils/translator';

const { b64ToBytes } = crypto.cryptoUtil;

const SIZE_BASE = 856;
const SIZE1 = 214;
const SIZE2 = 64;

const readFileB64 = async path => RNFS.readFile(path, 'base64');
const readFile = async path => readFileB64(path).then(b64ToBytes);

export { SIZE1, SIZE2 };

@observer
export default class AvatarActionSheet extends SafeComponent {
    _message = null;
    _chat = null;
    _galleryPicker = ImagePicker.openPicker.bind(ImagePicker);
    _cameraPicker = ImagePicker.openCamera.bind(ImagePicker);

    GALLERY_INDEX = 0;
    CAMERA_INDEX = 1;
    CANCEL_INDEX = 2;

    _actionSheetMap = [
        { title: tx('button_pickFromGallery'), action: () => this.pickCrop(false) },
        { title: tx('button_takeAPicture'), action: () => this.pickCrop(true) },
        { title: tx('button_cancel') }
    ];

    actionPress = index => {
        const { action } = this._actionSheetMap[index];
        action && action();
    };

    show = () => this._actionSheet.show();

    async save(largePath, smallPath) {
        const largeFileB64 = await readFileB64(largePath);
        const largeFile = await b64ToBytes(largeFileB64);
        // console.log(largeFile);
        const smallFile = await readFile(smallPath);
        // console.log(smallFile);
        return this.props.onSave([largeFile.buffer, smallFile.buffer], largeFileB64);
    }

    async generateResize(path) {
        try {
            // await FileOpener.open(path, 'image/jpeg');
            console.log(`profile-edit: resizing to ${SIZE1}`);
            const resizedPathLarge = await ImagePicker.resizeImageToMaxSize(path, SIZE1);
            // await FileOpener.open(resizedPathLarge, 'image/png');
            console.log(`profile-edit: resizing to ${SIZE2}`);
            const resizedPathSmall = await ImagePicker.resizeImageToMaxSize(path, SIZE2);
            // await FileOpener.open(resizedPathSmall, 'image/png');
            await this.save(resizedPathLarge, resizedPathSmall);
        } catch (e) {
            console.error(e);
        }
        await ImagePicker.clean();
    }

    async pickCrop(camera) {
        const data = await (camera ? this._cameraPicker : this._galleryPicker)({
            width: SIZE_BASE,
            height: SIZE_BASE,
            mediaType: 'photo',
            cropping: true
        });
        console.debug(data);
        await this.generateResize(data.path);
    }

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this._actionSheetMap.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                onPress={this.actionPress}
            />
        );
    }
}
