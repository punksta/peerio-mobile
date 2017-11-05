import React from 'react';
import { Platform } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import fileState from '../files/file-state';
import chatState from '../messaging/chat-state';
import { tx } from '../utils/translator';
import { popupInputCancelCheckbox } from '../shared/popups';
import imagepicker from '../helpers/imagepicker';

@observer
export default class FilesActionSheet extends SafeComponent {
    @observable image;

    get shareFromPeerio() {
        return {
            title: tx('title_shareFromFiles'),
            async action() { chatState.shareFiles(await fileState.selectFiles()); }
        };
    }

    get takePhoto() {
        return {
            title: tx('Take photo...'),
            async action() {
                fileState.uploadInFiles(await imagepicker.getImageFromCamera());
            }
        };
    }

    get chooseFromGallery() {
        return {
            title: tx('Choose from gallery...'),
            async action() {
                fileState.uploadInFiles(await imagepicker.getImageFromGallery());
            }
        };
    }

    get androidFilePicker() {
        return {
            title: tx('Choose from files...'),
            async action() {
                fileState.uploadInFiles(await imagepicker.getImageFromAndroidFilePicker());
            }
        };
    }

    get createFolder() {
        const action = async () => {
            const result = await popupInputCancelCheckbox(
                'Create a folder', 'Enter a folder name', null, null, true);
            if (!result) return;
            requestAnimationFrame(() => {
                fileState.store.fileFolders.createFolder(result.value, this.currentFolder);
                fileState.store.fileFolders.save();
            });
        };
        return { title: tx('Create a folder...'), action };
    }

    get items() {
        const result = [this.takePhoto, this.chooseFromGallery];
        this.props.inline && result.push(this.shareFromPeerio);
        (Platform.OS === 'android') && result.push(this.androidFilePicker);
        this.props.createFolder && result.push(this.createFolder);
        result.push({ title: tx('button_cancel') });
        return result;
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = () => {
        this._actionSheet.show();
    }

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.items.length - 1}
                onPress={this.onPress}
            />
        );
    }
}
