import React from 'react';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routerModal from '../routes/router-modal';
import { popupInput } from '../shared/popups';
import { fileHelpers } from '../../lib/icebear';
import routerMain from '../routes/router-main';
import FileActionSheetHeader from '../files/file-action-sheet-header';
import ActionSheetLayout from '../layout/action-sheet-layout';

export default class FilesActionSheet {
    static show(file) {
        const { isLegacy } = file;
        const header = (
            <FileActionSheetHeader
                file={file}
                onPress={() => {
                    ActionSheetLayout.hide();
                    routerModal.discard();
                    routerMain.files(file);
                }} />
        );
        const actionButtons = [
            {
                title: 'button_share',
                disabled: isLegacy,
                action: () => {
                    fileState.currentFile = file;
                    ActionSheetLayout.hide();
                    routerModal.shareFileTo();
                }
            },
            {
                title: 'button_move',
                action: () => {
                    fileState.currentFile = file;
                    ActionSheetLayout.hide();
                    routerModal.moveFileTo();
                }
            },
            {
                title: 'button_rename',
                action: async () => {
                    ActionSheetLayout.hide();
                    const newFileName = await popupInput(
                        tx('title_fileName'),
                        '',
                        fileHelpers.getFileNameWithoutExtension(file.name)
                    );
                    if (newFileName) { await file.rename(`${newFileName}.${file.ext}`); }
                }
            },
            {
                title: 'button_delete',
                isDestructive: true,
                action: async () => {
                    const result = await fileState.deleteFile(file);
                    if (result) ActionSheetLayout.hide();
                }
            }
        ];
        ActionSheetLayout.show({
            header,
            hasCancelButton: true,
            actionButtons
        });
    }
}
