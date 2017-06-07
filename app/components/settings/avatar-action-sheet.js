import React from 'react';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import FileOpener from 'react-native-file-opener';
import SafeComponent from '../shared/safe-component';

const SIZE_BASE = 428;
const SIZE1 = 214;
const SIZE2 = 64;

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
        { title: 'Pick from gallery...', action: () => this.pickCrop(false) },
        { title: 'Take a picture', action: () => this._chat.pickCrop(true) },
        { title: 'Cancel' }
    ];

    actionPress = index => {
        const { action } = this._actionSheetMap[index];
        action && action();
    };

    show = () => this._actionSheet.show();

    async generateResize(path) {
        console.log(path);
        try {
            await FileOpener.open(path, 'image/jpeg');
            let resizedPath = null;
            console.log(`profile-edit: resizing to ${SIZE1}`);
            resizedPath = await ImagePicker.resizeImageToMaxSize(path, SIZE1);
            await FileOpener.open(resizedPath, 'image/png');
            console.log(`profile-edit: resizing to ${SIZE2}`);
            resizedPath = await ImagePicker.resizeImageToMaxSize(path, SIZE2);
            await FileOpener.open(resizedPath, 'image/png');
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
        console.log(data);
        await this.generateResize(data.path);
    }

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => (this._actionSheet = sheet)}
                options={this._actionSheetMap.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                onPress={this.actionPress}
            />
        );
    }
}
