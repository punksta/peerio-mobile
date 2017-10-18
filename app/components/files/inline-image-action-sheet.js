import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import routerModal from '../routes/router-modal';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';

@observer
export default class InlineImageActionSheet extends SafeComponent {
    RETRY_INDEX = 0;
    DELETE_INDEX = 2;
    CANCEL_INDEX = 3;

    @observable image;
    @observable message;
    @observable chat;

    shareImage = () => {
        fileState.currentFile = this.image;
        routerModal.shareFileTo();
    }

    get openItem() {
        return {
            title: tx('button_open'),
            action: () => {
                when(() => this.image.cached, () => this.image.launchViewer());
                if (!this.image.cached) this.image.download(this.image.cachePath);
            }
        };
    }

    get items() {
        const { chat, message } = this;
        return [
            this.openItem,
            { title: tx('button_share'), action: this.shareImage },
            { title: tx('button_delete'), action: () => chat.removeMessage(message) },
            { title: tx('button_cancel') }
        ];
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = (image, message, chat) => {
        this.image = image;
        this.message = message;
        this.chat = chat;
        this._actionSheet.show();
    }

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.onPress}
            />
        );
    }
}
