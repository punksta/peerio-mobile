import { Linking, Platform } from 'react-native';
import { observable, action, when } from 'mobx';
import RNFS from 'react-native-fs';
import chatState from '../messaging/chat-state';
import RoutedState from '../routes/routed-state';
import { fileStore, TinyDb, socket, fileHelpers, clientApp } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { rnAlertYesNo } from '../../lib/alerts';
import { popupInput, popupYesCancel } from '../shared/popups';
import { promiseWhen } from '../helpers/sugar';

class FileState extends RoutedState {
    @observable currentFile = null;
    @observable currentFolder = null;
    localFileMap = observable.map();
    store = fileStore;
    _prefix = 'files';

    @action async init() {
        this.currentFolder = fileStore.fileFolders.root;
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
        const shared = !!f.filter(i => !!i.shared).length;
        let t = tx((count > 1) ? 'dialog_confirmDeleteFiles' : 'dialog_confirmDeleteFile', { count });
        if (shared) t += `\n${tx('title_confirmRemoveSharedFiles')}`;
        rnAlertYesNo(t)
            .then(() => {
                f.forEach(item => {
                    item.remove();
                });
                this.routerMain.files();
            })
            .catch(() => null);
    }

    async remindAboutEncryption() {
        if (Platform.OS !== 'android') return;
        let text = null;
        switch (global.fileEncryptionStatus) {
            case undefined: case 2: return;
            case 1: text = 'dialog_androidEncryptionStatusPartial'; break;
            default: text = 'dialog_androidEncryptionStatusOff';
        }
        if (await TinyDb.system.getValue('fileEncryptionStatusShown')) return;
        try {
            await rnAlertYesNo(null, tx(text));
            Linking.openURL('https://support.google.com/nexus/answer/2844831?hl=en');
        } catch (e) {
            console.log('file-state: user tap cancelled');
        }
        await TinyDb.system.setValue('fileEncryptionStatusShown', true);
    }

    async remindAboutExternal() {
        if (Platform.OS !== 'android') return true;
        if (await TinyDb.system.getValue('saved_toExternalShown')) return true;
        try {
            await rnAlertYesNo(null, tx('dialog_toExternal'));
            TinyDb.system.setValue('saved_toExternalShown', true);
        } catch (e) {
            return false;
        }
        return true;
    }

    @action async download(fp) {
        await this.remindAboutEncryption();
        if (!await this.remindAboutExternal()) {
            console.log('file-state.js: user denied saving to external');
            return;
        }
        const singleFile = fp || this.currentFile;
        const f = singleFile ? [singleFile] : this.selected;
        f.forEach(file => {
            file.selected = false;
            if (file.downloading || file.uploading) return;
            file.readyForDownload && file.download(file.cachePath);
        });
    }

    @action resetSelection() {
        this.selected.forEach(f => { f.selected = false; });
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

    renamePostProcessing = async ({ file, fileName, ext }) => {
        await promiseWhen(() => file.size);
        if (file.deleted) return null;
        const newFileName = await popupInput(tx('title_fileName'), '', fileHelpers.getFileNameWithoutExtension(fileName));
        if (newFileName) await file.rename(`${newFileName}.${ext}`);
        return file;
    }

    uploadInline = async (data) => {
        await promiseWhen(() => socket.authenticated);
        const chat = chatState.currentChat;
        if (!chat) throw new Error('file-state.js, uploadInline: no chat selected');
        let renamePromise = null;
        data.file = chat.uploadAndShareFile(data.url, data.fileName, false, () => renamePromise);
        renamePromise = this.renamePostProcessing(data);
        await promiseWhen(() => data.file.fileId);
        // TODO: this may be a cause for race-condition
        // e.g.: the message with file id appears before copying is finished
        console.log(`copy from ${data.url} to ${data.file.tmpCachePath}`);
        await RNFS.copyFile(data.url, data.file.tmpCachePath);
        return data.file;
    }

    uploadInFiles = async (data) => {
        await promiseWhen(() => socket.authenticated);
        const folder = this.currentFolder;
        const file = fileStore.upload(data.url, data.fileName);
        if (folder && !folder.isRoot) {
            await promiseWhen(() => file.fileId);
            folder.moveInto(file);
            this.store.fileFolders.save();
        }
        data.file = file;
        await this.renamePostProcessing(data);
        return file;
    }

    cancelUpload(file) {
        return popupYesCancel(tx('title_confirmCancelUpload')).then(r => r && file.cancelUpload());
    }

    onTransition(active, file) {
        console.log('files on transition');
        clientApp.isInFilesView = active && !!file;
        this.currentFile = active ? file : null;
    }

    get title() {
        return this.currentFile ? this.currentFile.name : tx('title_fileFilterAll');
    }
}

export default new FileState();
