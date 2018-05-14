import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';
import routes from '../routes/routes';
import snackbarState from '../snackbars/snackbar-state';

@observer
export default class InlineFileActionSheet extends SafeComponent {
    @observable file;

    sharefile = () => {
        fileState.currentFile = this.file;
        routes.modal.shareFileTo();
    };

    get fileExists() {
        if (!this.file) return false;
        // if we uploaded the image ourselves, it's in the localFileMap
        // TODO: move to icebear
        const selfTmpCachePath = fileState.localFileMap.get(this.file.fileId);
        return !!selfTmpCachePath || this.file.cached;
    }

    get openItem() {
        const title = this.fileExists ? tx('button_open') : tx('button_download');
        return {
            title,
            action: () => {
                when(
                    () => this.fileExists,
                    () => {
                        // if we uploaded the image ourselves, it's in the localFileMap
                        // TODO: move to icebear
                        const selfTmpCachePath = fileState.localFileMap.get(this.file.fileId);
                        this.file.launchViewer(selfTmpCachePath).catch(
                            () => snackbarState.pushTemporary(tx('snackbar_couldntOpenFile'))
                        );
                    }
                );
                if (!this.fileExists) fileState.download(this.file);
            }
        };
    }

    moveFile = () => {
        fileState.currentFile = this.file;
        routes.modal.moveFileTo();
    };
    get moveItem() {
        return {
            title: tx('button_move'),
            action: () => this.moveFile()
        };
    }

    deleteFile = () => {
        fileState.currentFile = this.file;
        fileState.delete();
    };
    get deleteItem() {
        return {
            title: tx('button_delete'),
            action: () => this.deleteFile()
        };
    }

    get items() {
        const array = [];
        array.push(this.openItem);
        if (this.fileExists) { array.push(this.moveItem); }
        array.push({ title: tx('button_share'), action: this.sharefile });
        if (this.fileExists) { array.push(this.deleteItem); }
        array.push({ title: tx('button_cancel') });
        return array;
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = (file) => {
        this.file = file;
        this._actionSheet.show();
    };

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
