import React from 'react';
import { View } from 'react-native';
import { tx, tu } from '../utils/translator';
import popupState from '../layout/popup-state';
import { textControl } from '../shared/popups';
import { fileStore } from '../../lib/icebear';
import UpdateProgressIndicator from '../controls/update-progress-indicator';
import uiState from '../layout/ui-state';

class popupFileSystemUpgrade {
    showUpgradeNotificationPopup() {
        return popupState.showPopupPromise(resolve => ({
            type: 'systemUpgrade',
            title: textControl(tx('title_upgradeFileSystem')),
            contents: (
                <View>
                    {textControl(tx('title_upgradeFileSystemDescription1'))}
                    {textControl(tx('title_upgradeFileSystemDescription2'))}
                    {fileStore.hasFilesShared && textControl(tx('title_upgradeFileSystemDescription3'))}
                </View>
            ),
            buttons: [
                { id: 'update', text: tu('button_update'), action: () => resolve(true) }
            ]
        }));
    }

    showUpgradeProgressPopup() {
        return popupState.showPopupPromise(() => ({
            type: 'systemUpgrade',
            title: textControl(tx('title_fileUpdateProgress')),
            contents: (
                <View>
                    <UpdateProgressIndicator progress={uiState.fileUpdateProgress} />
                    {textControl(tx('title_fileUpdateProgressDescription'))}
                </View>
            )
        }));
    }
}


export default new popupFileSystemUpgrade();
