import { observable, action } from 'mobx';
import mainState from '../main/main-state';
import { fileStore } from '../../lib/icebear';

const fileState = observable({
    get showSelection() {
        return !!this.selected.length;
    },

    get selected() {
        return fileStore.files.filter(f => f.selected);
    },

    @action delete() {
        const f = mainState.currentFile ? [mainState.currentFile] : this.selected;
        console.log('file-state.js: ', f);
        f.forEach(item => {
            fileStore.remove(item);
        });
        mainState.back();
    },

    @action download() {
        const f = mainState.currentFile ? [mainState.currentFile] : this.selected;
        f.forEach(file => {
            if (file.downloading || file.uploading) return;
            file.download();
            file.selected = false;
        });
    }
});

export default fileState;
