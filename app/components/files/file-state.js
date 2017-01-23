import { Linking, Platform } from 'react-native';
import { observable, action, when } from 'mobx';
import mainState from '../main/main-state';
import { fileStore, TinyDb } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { rnAlertYesNo, rnAlertYes } from '../../lib/alerts';

const fileState = observable({
    get showSelection() {
        return !!this.selected.length;
    },

    get selected() {
        return fileStore.files.filter(f => f.selected);
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
            .then(shown => (shown ? Promise.reject(new Error('Already shown')) : Promise.resolve()))
            .then(() => rnAlertYesNo(null, tx(text)))
            .then(() => Linking.openURL('https://support.google.com/nexus/answer/2844831?hl=en'))
            .catch(e => console.log(e))
            .finally(() => TinyDb.system.setValue('fileEncryptionStatusShown', true)) : Promise.resolve();
    },

    remindAboutExternal() {
        return Platform.OS === 'android' ?
            TinyDb.system.getValue('saved_toExternalShown')
                .then(shown => (shown ? Promise.reject(new Error('Already shown')) : Promise.resolve()))
                .then(() => rnAlertYesNo(null, tx('saved_toExternal')))
                .then(() => {
                    TinyDb.system.setValue('saved_toExternalShown', true);
                    return Promise.resolve(true);
                })
                .catch(() => Promise.resolve(false)) : Promise.resolve(true);
    },

    download: action.bound(function() {
        this.remindAboutEncryption().then(() => this.remindAboutExternal()).then(r => {
            if (!r) return;
            const f = mainState.currentFile ? [mainState.currentFile] : this.selected;
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
    })
});

export default fileState;
