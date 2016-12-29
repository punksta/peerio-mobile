import { observable, action } from 'mobx';
import mainState from '../main/main-state';
import { fileStore } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { rnAlertYesNo } from '../../lib/alerts';

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

    @action download() {
        const f = mainState.currentFile ? [mainState.currentFile] : this.selected;
        f.forEach(file => {
            if (file.downloading || file.uploading) return;
            file.download();
            file.selected = false;
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
