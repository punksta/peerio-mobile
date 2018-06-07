import React from 'react';
import { when } from 'mobx';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routes from '../routes/routes';
import ActionSheetLayout from '../layout/action-sheet-layout';
import { fileHelpers, config } from '../../lib/icebear';
import FileActionSheetHeader from '../files/file-action-sheet-header';
import { popupInput } from '../shared/popups';
import snackbarState from '../snackbars/snackbar-state';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';

export default class FileActionSheet {
    static async show(file, fileAutoOpen, routeAfterDelete) {
        // TODO: remove when SDK is ready and/or move to SDK
        try {
            if (await config.FileStream.exists(file.tmpCachePath)) {
                file.tmpCached = true;
            } else if (await config.FileStream.exists(file.cachePath)) {
                file.cached = true;
            }
        } catch (e) {
            console.log(e);
        }
        if (!file) {
            snackbarState.pushTemporary(tx('snackbar_fileNotFound'));
            return;
        }
        const { isLegacy } = file;
        const header = (<FileActionSheetHeader
            file={file}
            onPress={() => {
                routerModal.discard();
                routerMain.files(file);
                ActionSheetLayout.hide();
            }}
        />);

        // Files that exist can be opened right away
        // Files that dont exist need to be downloaded firs
        const title = file.hasFileAvailableForPreview ? tx('button_open') : tx('button_download');
        const actionButtons = [];

        // Share
        actionButtons.push({
            title: tx('button_share'),
            disabled: isLegacy,
            action: () => {
                fileState.currentFile = file;
                routes.modal.shareFileTo();
            }
        });

        // Open / Download
        if (file.isImage) {
            actionButtons.push({
                title,
                // Opens the image using the right path if it exists, else attempts to download it
                action: () => {
                    if (file.hasFileAvailableForPreview) {
                        file.launchViewer();
                    } else {
                        fileState.download(file);
                    }
                }
            });
        } else {
            // If file is cached, open in viewer
            // If file is NOT cached, download and then when download is complete open in viewer
            actionButtons.push({
                title,
                action: () => {
                    if (file.hasFileAvailableForPreview) {
                        file.launchViewer();
                    } else {
                        fileState.download(file);
                        if (fileAutoOpen) when(() => file.cached, () => file.launchViewer());
                    }
                }
            });
        }

        // Move
        actionButtons.push({
            title: tx('button_move'),
            disabled: isLegacy,
            action: () => {
                fileState.currentFile = file;
                routes.modal.moveFileTo();
            }
        });

        // Rename
        actionButtons.push({
            title: tx('button_rename'),
            disabled: isLegacy,
            action: async () => {
                const newFileName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(file.name),
                    { autoCapitalize: 'sentences' }
                );
                if (newFileName) await file.rename(`${newFileName}.${file.ext}`);
            }
        });

        // Delete
        actionButtons.push({
            title: 'button_delete',
            isDestructive: true,
            action: async () => {
                const result = await fileState.deleteFile(file);
                if (result) {
                    ActionSheetLayout.hide();
                    if (routeAfterDelete) routes.main[routeAfterDelete]();
                }
            }
        });

        ActionSheetLayout.show({
            header,
            actionButtons,
            hasCancelButton: true
        });
    }
}
