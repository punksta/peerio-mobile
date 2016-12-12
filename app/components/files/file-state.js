import { observable, asMap, action, computed } from 'mobx';
import mainState from '../main/main-state';
import { fileStore } from '../../lib/icebear';

const fileState = observable({
    @computed get showSelection() {
        return !!this.selected.length;
    },

    @computed get selected() {
        return fileStore.files.filter(f => f.selected);
    },

    @action delete() {
        mainState.back();
        const f = mainState.currentFile ? [mainState.currentFile] : this.selected;
        f.forEach(item => {
            fileStore.remove(item);
        });
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
