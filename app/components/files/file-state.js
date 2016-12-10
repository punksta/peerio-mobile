import { observable, asMap, action, computed } from 'mobx';

const fileState = observable({
    @computed get showSelection() {
        return this.selected.size > 0;
    },

    selected: asMap({}),

    @action select(fileId, value) {
        value ? this.selected.set(fileId, value) : this.selected.delete(fileId);
    }
});

export default fileState;
