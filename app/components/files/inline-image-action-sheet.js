import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import routerModal from '../routes/router-modal';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';
import snackbarState from '../snackbars/snackbar-state';

@observer
export default class InlineImageActionSheet extends SafeComponent {
    @observable image;
    @observable _actionSheet = null;
    @observable key = 0;

    shareImage = () => {
        fileState.currentFile = this.image;
        routerModal.shareFileTo();
    };

    get actionItem() {
        const title = this.image.hasFileAvailableForPreview ? tx('button_open') : tx('button_download');
        return {
            title,
            action: () => {
                const { image } = this;
                when(() => image.hasFileAvailableForPreview,
                    () => image.launchViewer().catch(() => {
                        snackbarState.pushTemporary(tx('snackbar_couldntOpenFile'));
                    }));
                if (!image.hasFileAvailableForPreview) {
                    image.isOversizeCutoff ? fileState.download(this.image) : image.tryToCacheTemporarily(true);
                }
            }
        };
    }

    get items() {
        const itemsArray = [
            this.actionItem,
            { title: tx('button_share'), action: this.shareImage },
            { title: tx('button_cancel') }
        ];
        return itemsArray;
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = (image) => {
        this._actionSheet = null;
        this.image = image;
        this.key++;
        when(() => this._actionSheet, () => this._actionSheet.show());
    };

    renderThrow() {
        if (!this.image) return null;
        return (
            <ActionSheet
                key={this.key}
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.items.length - 1}
                onPress={this.onPress}
            />
        );
    }
}
