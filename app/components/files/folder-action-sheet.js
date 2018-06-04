import React from 'react';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import { popupInput, popupFolderDelete } from '../shared/popups';
import { fileHelpers, volumeStore, config } from '../../lib/icebear';
import FileActionSheetHeader from '../files/file-action-sheet-header';
import ActionSheetLayout from '../layout/action-sheet-layout';

export default class FoldersActionSheet {
    static show(folder) {
        const { hasLegacyFiles, convertingToVolume, isShared, isOwner } = folder;
        const header = (
            <FileActionSheetHeader file={folder} />
        );
        const folderShareAction = {
            title: 'button_share',
            disabled: hasLegacyFiles || convertingToVolume,
            action: async () => {
                // TODO add logic for folder.isOwner
                // TODO: refactor this, this is confusing and bad
                fileState.currentFile = folder;
                const contacts = await routerModal.shareFolderTo();
                if (!contacts) return;
                await volumeStore.shareFolder(folder, contacts);
            }
        };
        const actionButtons = [
            {
                title: 'button_move',
                disabled: isShared,
                action: () => {
                    fileState.currentFile = folder;
                    routes.modal.moveFileTo();
                }
            },
            {
                title: tx('button_rename'),
                action: async () => {
                    const newFolderName = await popupInput(
                        tx('title_fileName'),
                        '',
                        fileHelpers.getFileNameWithoutExtension(folder.name)
                    );
                    if (newFolderName) { await folder.rename(`${newFolderName}`); }
                }
            },
            /* unshare is hidden right now */
            /* TODO: add unshare folder */
            /*
            {
                title: tx('button_unshare'),
                disabled: !folder.isShared,
                action: async () => {
                    folder.isShared = false;
                    folder.isJustUnshared = true;
                }
            }, */
            {
                title: 'button_delete',
                disabled: convertingToVolume,
                isDestructive: true,
                action: async () => {
                    // icebear will call this function to confirm file deletion
                    fileState.store.bulk.deleteFolderConfirmator = () => {
                        return popupFolderDelete(isShared, isOwner);
                    };
                    await fileState.store.bulk.removeOne(folder);
                    fileState.store.bulk.deleteFolderConfirmator = null;
                }
            }
        ];
        if (config.enableSharedFolders) actionButtons.unshift(folderShareAction);
        ActionSheetLayout.show({
            header,
            hasCancelButton: true,
            actionButtons
        });
    }
}
