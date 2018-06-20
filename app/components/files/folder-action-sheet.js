import React from 'react';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import { popupInput, popupFolderDelete } from '../shared/popups';
import { fileHelpers, volumeStore, config, User } from '../../lib/icebear';
import FileActionSheetHeader from '../files/file-action-sheet-header';
import ActionSheetLayout from '../layout/action-sheet-layout';
import routerModal from '../routes/router-modal';
import routes from '../routes/routes';
import chatState from '../messaging/chat-state';

export default class FoldersActionSheet {
    static show(folder, canUnshare) {
        const { hasLegacyFiles, isShared, owner } = folder;
        const isOwner = !owner || owner === User.current.username;

        const header = (
            <FileActionSheetHeader file={folder} />
        );
        const folderShareAction = {
            title: 'button_share',
            disabled: hasLegacyFiles,
            action: async () => {
                // TODO add logic for isOwner
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
            }
        ];

        if (canUnshare) {
            actionButtons.push({
                title: tx('button_unshare'),
                action: async () => {
                    folder.removeParticipant(chatState.currentChat.otherParticipants[0]);
                }
            });
        }

        actionButtons.push({
            title: 'button_delete',
            isDestructive: true,
            action: async () => {
                // icebear will call this function to confirm file deletion
                fileState.store.bulk.deleteFolderConfirmator = () => {
                    return popupFolderDelete(isShared, isOwner);
                };
                await fileState.store.bulk.removeOne(folder);
                fileState.store.bulk.deleteFolderConfirmator = null;
            }
        });

        if (config.enableVolumes) actionButtons.unshift(folderShareAction);
        ActionSheetLayout.show({
            header,
            hasCancelButton: true,
            actionButtons
        });
    }
}
