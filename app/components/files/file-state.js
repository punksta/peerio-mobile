import { Linking, Platform } from 'react-native';
import { observable, action, when } from 'mobx';
import moment from 'moment';
import mainState from '../main/main-state';
import { fileStore, TinyDb, socket, fileHelpers } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { rnAlertYesNo } from '../../lib/alerts';
import { popupInput, popupYesCancel } from '../shared/popups';
import imagePicker from '../helpers/imagepicker';

const fileState = observable({
    get showSelection() {
        return fileStore.hasSelectedFiles;
    },

    get selected() {
        return fileStore.getSelectedFiles();
    },

    delete: action.bound(function() {
        const f = mainState.currentFile ? [mainState.currentFile] : this.selected;
        const count = f.length;
        const t = tx((count > 1) ? 'confirm_deleteFiles' : 'confirm_deleteFile', { count });
        rnAlertYesNo(t)
            .then(() => {
                f.forEach(item => {
                    fileStore.remove(item);
                });
                mainState.files();
            })
            .catch(() => null);
    }),

    remindAboutEncryption() {
        let text = null;
        switch (global.fileEncryptionStatus) {
            case undefined: case 2: break;
            case 1: text = 'androidEncryptionStatusPartial'; break;
            default: text = 'androidEncryptionStatusOff';
        }
        return text ? TinyDb.system.getValue('fileEncryptionStatusShown')
            .then(shown => (shown ?
                Promise.reject(new Error('file-state.js: already shown')) : Promise.resolve()))
            .then(() => rnAlertYesNo(null, tx(text)))
            .then(() => Linking.openURL('https://support.google.com/nexus/answer/2844831?hl=en'))
            .catch(e => console.log(e))
            .finally(() => TinyDb.system.setValue('fileEncryptionStatusShown', true)) : Promise.resolve();
    },

    remindAboutExternal() {
        return Platform.OS === 'android' ?
            TinyDb.system.getValue('saved_toExternalShown')
                .then(shown => (shown ?
                    Promise.reject(new Error('file-state.js: already shown')) : Promise.resolve()))
                .then(() => rnAlertYesNo(null, tx('saved_toExternal')))
                .then(() => {
                    TinyDb.system.setValue('saved_toExternalShown', true);
                    return Promise.resolve(true);
                })
                .catch(() => Promise.resolve(false)) : Promise.resolve(true);
    },

    download: action.bound(function(fp) {
        this.remindAboutEncryption().then(() => this.remindAboutExternal()).then(r => {
            if (!r) return;
            const singleFile = fp || mainState.currentFile;
            const f = singleFile ? [singleFile] : this.selected;
            f.forEach(file => {
                file.selected = false;
                if (file.downloading || file.uploading) return;
                file.readyForDownload && file.download(file.cachePath);
            });
        });
    }),

    resetSelection: action.bound(function() {
        this.selected.forEach(f => (f.selected = false));
    }),

    selectFiles: action.bound(function() {
        this.resetSelection();
        return new Promise((resolve, reject) => {
            this.resolveFileSelection = resolve;
            this.rejectFileSelection = reject;
            mainState.showModal('selectFiles');
        });
    }),

    exitSelectFiles: action.bound(function() {
        this.resetSelection();
        mainState.discardModal();
        this.rejectFileSelection && this.rejectFileSelection(new Error(`file-state.js: user cancel`));
        this.rejectFileSelection = null;
    }),

    submitSelectFiles: action.bound(function() {
        this.resolveFileSelection(this.selected.slice());
        this.resolveFileSelection = null;
        this.resetSelection();
        mainState.discardModal();
    }),

    uploadInline(uri, fileName, fileData) {
        return fileState.upload(uri, fileName, fileData, true);
    },

    upload(uri, fileName, fileData, inline) {
        let fn = fileHelpers.getFileName(fileName || uri);
        const ext = fileHelpers.getFileExtension(fn);
        if (!fileName) {
            fn = `${moment(Date.now()).format('llll')}.${ext}`;
        }
        const chat = mainState.currentChat;
        const uploader = inline ? () => chat.uploadAndShareFile(uri, fileName) :
            () => fileStore.upload(uri, fileName);
        return new Promise(resolve => {
            when(() => socket.authenticated,
                () => resolve(uploader(uri, fn)));
        }).then(file => {
            return popupInput(tx('popup_tapToRename'), fileHelpers.getFileNameWithoutExtension(fn))
                .then(newFileName => {
                    if (!newFileName) return Promise.resolve();
                    file.name = `${newFileName}.${ext}`;
                    return file.saveToServer();
                });
        });
    },

    cancelUpload(file) {
        return popupYesCancel(tx('popup_cancelFileUpload')).then(r => r && fileStore.cancelUpload(file));
    }
});

mainState.fabActions.files = () => {
    imagePicker.show([], fileState.upload);
};

global.fileHelpers = fileHelpers;

export default fileState;
