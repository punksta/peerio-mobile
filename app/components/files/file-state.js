import { Linking, Platform } from 'react-native';
import { observable, action, when } from 'mobx';
import mainState from '../main/main-state';
import { fileStore } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { rnAlertYesNo, rnAlertYes } from '../../lib/alerts';
import db from '../../store/local-storage';

const fileState = observable({
    get showSelection() {
        return !!this.selected.length;
    },

    get selected() {
        return fileStore.files.filter(f => f.selected);
    },

    @action delete() {
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
    },

    @action remindAboutEncryption() {
        let text = null;
        switch (global.fileEncryptionStatus) {
            case undefined: case 2: break;
            case 1: text = 'androidEncryptionStatusPartial'; break;
            default: text = 'androidEncryptionStatusOff';
        }
        return text ? db.system.get('fileEncryptionStatusShown')
            .then(shown => shown ? Promise.reject(new Error('Already shown')) : Promise.resolve())
            .then(() => rnAlertYesNo(null, tx(text)))
            .then(() => Linking.openURL('https://support.google.com/nexus/answer/2844831?hl=en'))
            .catch(e => console.log(e))
            .finally(() => db.system.set('fileEncryptionStatusShown', true)) : Promise.resolve();
    },

    @action remindAboutExternal() {
        return Platform.OS === 'android' ?
            db.system.get('saved_toExternalShown')
                .then(shown => shown ? Promise.reject(new Error('Already shown')) : Promise.resolve())
                .then(() => rnAlertYesNo(null, tx('saved_toExternal')))
                .then(() => {
                    db.system.set('saved_toExternalShown', true);
                    return Promise.resolve(true);
                })
                .catch(() => Promise.resolve(false)) : Promise.resolve(true);
    },

    @action download() {
        this.remindAboutEncryption().then(() => this.remindAboutExternal()).then(r => {
            if (!r) return;
            const f = mainState.currentFile ? [mainState.currentFile] : this.selected;
            f.forEach(file => {
                file.selected = false;
                if (file.downloading || file.uploading) return;
                file.readyForDownload && file.download();
            });
        });
    },

    @action resetSelection() {
        this.selected.forEach(f => (f.selected = false));
    },

    @action selectFiles() {
        this.resetSelection();
        return new Promise((resolve, reject) => {
            this.resolveFileSelection = resolve;
            this.rejectFileSelection = reject;
            mainState.showModal('selectFiles');
        });
    },

    @action exitSelectFiles() {
        this.resetSelection();
        mainState.discardModal();
        this.rejectFileSelection && this.rejectFileSelection(new Error(`file-state.js: user cancel`));
        this.rejectFileSelection = null;
    },

    @action submitSelectFiles() {
        this.resolveFileSelection(this.selected.slice());
        this.resolveFileSelection = null;
        this.resetSelection();
        mainState.discardModal();
    }
});

export default fileState;
