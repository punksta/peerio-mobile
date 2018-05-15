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

    shareImage = () => {
        fileState.currentFile = this.image;
        routerModal.shareFileTo();
    };

    get openItem() {
        return {
            title: tx('button_open'),
            action: () => {
                const { image } = this;
                when(() => image.hasFileAvailableForPreview,
                    () => image.launchViewer().catch(() => {
                        snackbarState.pushTemporary(tx('snackbar_couldntOpenFile'));
                    }));
                if (!image.hasFileAvailableForPreview) image.tryToCacheTemporarily(true);
            }
        };
    }

    get items() {
        return [
            this.openItem,
            { title: tx('button_share'), action: this.shareImage },
            { title: tx('button_cancel') }
        ];
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = (image) => {
        this.image = image;
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
