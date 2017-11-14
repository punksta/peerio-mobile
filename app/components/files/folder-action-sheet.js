import React from 'react';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import fileState from './file-state';
import { tx } from '../utils/translator';

@observer
export default class FolderActionSheet extends SafeComponent {
    DELETE_INDEX = 0;
    CANCEL_INDEX = 1;

    folder = null;

    actionSheetItems = [
        { title: tx('button_delete'), action: () => fileState.store.folders.deleteFolder(this.folder) },
        { title: tx('button_cancel') }
    ];

    itemPress = index => {
        const { action } = this.actionSheetItems[index];
        action && action();
    };

    show(folder) {
        this.folder = folder;
        this._actionSheet.show();
    }

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.actionSheetItems.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.itemPress}
            />
        );
    }
}
