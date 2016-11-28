import { observable, computed, action } from 'mobx';

const snackbarState = observable({
    @computed get text() {
        return this.messages.length ?
            this.messages[this.messages.length - 1] : null;
    },

    @action push(text) {
        this.messages.push(text);
    },

    @action pop() {
        this.messages.length && this.messages.splice(-1);
    },

    @action set(text) {
        this.messages = [text];
    },

    @action reset() {
        this.messages = [];
    },

    messages: []
});

export default snackbarState;
