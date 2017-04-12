import { Linking, Platform } from 'react-native';
import { observable, action, when } from 'mobx';
import moment from 'moment';
import chatState from '../messaging/chat-state';
import RoutedState from '../routes/routed-state';
import { fileStore, TinyDb, socket, fileHelpers, errors, User } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { rnAlertYesNo } from '../../lib/alerts';
import { popupInput, popupYesCancel, popupUpgrade } from '../shared/popups';
import imagePicker from '../helpers/imagepicker';

class FileState extends RoutedState {
    @observable currentFile = null;
    store = fileStore;
    _prefix = 'files';

    @action async init() {
        this.store.loadAllFiles();
        return new Promise(resolve => when(() => !this.store.loading, resolve));
    }

    get showSelection() {
        return fileStore.hasSelectedFiles;
    }

    get selected() {
        return fileStore.getSelectedFiles();
    }

    @action delete() {
        const f = this.currentFile ? [this.currentFile] : this.selected;
        const count = f.length;
        const t = tx((count > 1) ? 'confirm_deleteFiles' : 'confirm_deleteFile', { count });
        rnAlertYesNo(t)
            .then(() => {
                f.forEach(item => {
                    item.remove();
                });
                this.routerMain.files();
            })
            .catch(() => null);
    }

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
    }

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
    }

    @action download(fp) {
        this.remindAboutEncryption().then(() => this.remindAboutExternal()).then(r => {
            if (!r) return;
            const singleFile = fp || this.currentFile;
            const f = singleFile ? [singleFile] : this.selected;
            f.forEach(file => {
                file.selected = false;
                if (file.downloading || file.uploading) return;
                file.readyForDownload && file.download(file.cachePath);
            });
        });
    }

    @action resetSelection() {
        this.selected.forEach(f => (f.selected = false));
    }

    @action selectFiles() {
        this.resetSelection();
        return new Promise((resolve, reject) => {
            this.resolveFileSelection = resolve;
            this.rejectFileSelection = reject;
            this.routerModal.selectFiles();
        });
    }

    @action exitSelectFiles() {
        this.resetSelection();
        this.routerModal.discard();
        this.rejectFileSelection && this.rejectFileSelection(new Error(`file-state.js: user cancel`));
        this.rejectFileSelection = null;
    }

    @action submitSelectFiles() {
        this.resolveFileSelection(this.selected.slice());
        this.resolveFileSelection = null;
        this.resetSelection();
        this.routerModal.discard();
    }

    uploadInline = (uri, fileName, fileData) => {
        return this.upload(uri, fileName, fileData, true);
    }

    upload(uri, fileName, fileData, inline) {
        let fn = fileHelpers.getFileName(fileName || uri);
        const ext = fileHelpers.getFileExtension(fn);
        if (!fileName) {
            fn = `${moment(Date.now()).format('llll')}.${ext}`;
        }
        const chat = chatState.currentChat;
        const uploader = inline ? () => chat.uploadAndShareFile(uri, fileName) :
            () => fileStore.upload(uri, fileName);
        return new Promise(resolve => {
            when(() => socket.authenticated,
                () => resolve(uploader(uri, fn)));
        }).then(file => {
            // TODO: better way to check that file passed stat check
            setTimeout(() => {
                if (file.deleted) return;
                popupInput(tx('popup_tapToRename'), fileHelpers.getFileNameWithoutExtension(fn))
                    .then(newFileName => {
                        if (!newFileName) return Promise.resolve();
                        file.name = `${newFileName}.${ext}`;
                        return file.saveToServer();
                    });
            }, 500);
        });
    }

    cancelUpload(file) {
        return popupYesCancel(tx('popup_cancelFileUpload')).then(r => r && file.cancelUpload());
    }

    onTransition(active, file) {
        console.log('files on transition');
        active && fileStore.loadAllFiles();
        fileStore.active = active;
        this.currentFile = active ? file : null;
    }

    get title() {
        return this.currentFile ? this.currentFile.name : tx('title_fileFilterAll');
    }

    fabAction() {
        console.log(`file-state.js: fab action`);
        imagePicker.show([], this.upload);
    }
}

export default new FileState();
