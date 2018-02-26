import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import routerModal from '../routes/router-modal';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';

@observer
export default class InlineFileActionSheet extends SafeComponent {
    @observable file;

    sharefile = () => {
        fileState.currentFile = this.file;
        routerModal.shareFileTo();
    };

    get openItem() {
        const exists = this.file && !this.file.isPartialDownload && this.file.cached;
        const title = exists ? tx('button_open') : tx('button_download');
        return {
            title,
            action: () => {
                when(() => exists, this.file.launchViewer());
                if (!this.file.cached) fileState.download(this.file);
            }
        };
    }

    get items() {
        return [
            this.openItem,
            { title: tx('button_share'), action: this.sharefile },
            { title: tx('button_cancel') }
        ];
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
