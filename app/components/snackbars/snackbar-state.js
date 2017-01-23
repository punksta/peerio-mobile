import { observable, action, reaction } from 'mobx';
import { systemWarnings } from '../../lib/icebear';
import { t } from '../utils/translator';

const snackbarState = observable({
    get text() {
        return this.items.length ?
            this.items[this.items.length - 1].text : null;
    },

    push: action.bound(function(text, callback) {
        this.items.push({ text, callback });
    }),

    pop: action.bound(function() {
        if (!this.items.length) return;
        const i = this.items[this.items.length - 1];
        const _pop = () => (this.items.length && this.items.splice(-1));
        i.callback && i.callback();
        _pop();
    }),

    set: action.bound(function(text) {
        this.items = [text];
    }),

    reset: action.bound(function() {
        this.items = [];
    }),

    items: observable.shallow([])
});

reaction(() => systemWarnings.collection.length, (l) => {
    console.log('snackbar-state.js: server warning update');
    if (l) {
        const sw = systemWarnings.collection[l - 1];
        snackbarState.push(t(sw.content), () => {
            console.log('snackbar-state.js: server warning cleared');
            sw && sw.action && sw.action();
        });
    }
});

// snackbarState.push(t('address_confirmationSent'));

export default snackbarState;
