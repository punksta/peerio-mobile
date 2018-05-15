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
    @observable _actionSheet = null;
    @observable key = 0;

    sharefile = () => {
        fileState.currentFile = this.file;
        routes.modal.shareFileTo();
    };

    get openItem() {
        const title = this.file.hasFileAvailableForPreview ? tx('button_open') : tx('button_download');
        return {
            title,
            action: () => {
                when(
                    () => this.file.hasFileAvailableForPreview,
                    () => {
                        this.file.launchViewer().catch(
                            () => snackbarState.pushTemporary(tx('snackbar_couldntOpenFile'))
                        );
                    }
                );
                if (!this.file.hasFileAvailableForPreview) fileState.download(this.file);
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
        fileState.delete(true);
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
        array.push(this.moveItem);
        array.push({ title: tx('button_share'), action: this.sharefile });
        array.push(this.deleteItem);
        array.push({ title: tx('button_cancel') });
        return array;
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = (file) => {
        this._actionSheet = null;
        this.file = file;
        this.key++;
        when(() => this._actionSheet, () => this._actionSheet.show());
    };

    renderThrow() {
        if (!this.file) return null;
        return (
            <ActionSheet
                key={this.key}
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.items.length - 1}
                destructiveButtonIndex={this.items.length - 2}
                onPress={this.onPress}
            />
        );
    }
}
