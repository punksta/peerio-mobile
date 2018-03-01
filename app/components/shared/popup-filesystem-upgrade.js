import React from 'react';
import { View } from 'react-native';
import { tx, tu } from '../utils/translator';
import popupState from '../layout/popup-state';
import { textControl } from '../shared/popups';
import { fileStore } from '../../lib/icebear';

class popupFileSystemUpgrade {
    shouldShowPopup() {
        return fileStore.hasFilesShared && fileStore.fileSystemUpgradeRequired;
    }

    showFirstPopup() {
        return popupState.showPopupPromise(resolve => ({
            type: 'systemWarning',
            title: textControl(tx('title_upgradeFileSystem')),
            contents: (
                <View>
                    {textControl(tx('title_upgradeFileSystemDescription1'))}
                    {textControl(tx('title_upgradeFileSystemDescription2'))}
                </View>
            ),
            buttons: [
                { id: 'unshare', text: tu('button_unshare'), action: () => resolve(false), secondary: true },
                { id: 'continue', text: tu('button_continue'), action: () => resolve(true) }
            ]
        }));
    }

    showConfirmationPopup() {
        return popupState.showPopupPromise(resolve => ({
            type: 'systemWarning',
            title: textControl(tx('title_upgradeFileSystemConfirmation1')),
            contents: (
                <View>
                    {textControl(tx('title_upgradeFileSystemConfirmation2'))}
                </View>
            ),
            buttons: [
                { id: 'cancel', text: tu('button_cancel'), action: () => resolve(false), secondary: true },
                { id: 'unshareAll', text: tu('button_unshareAll'), action: () => resolve(true) }
            ]
        }));
    }
}


export default new popupFileSystemUpgrade();
