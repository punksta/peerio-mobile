import { observable, action, reaction, asFlat } from 'mobx';
import { systemWarnings } from '../../lib/icebear';
import { t } from '../utils/translator';

const snackbarState = observable({
    get text() {
        return this.items.length ?
            this.items[this.items.length - 1].text : null;
    },

    @action push(text, callback) {
        this.items.push({ text, callback });
    },

    @action pop() {
        if (!this.items.length) return;
        const i = this.items[this.items.length - 1];
        const _pop = () => (this.items.length && this.items.splice(-1));
        i.callback && i.callback();
        _pop();
    },

    @action set(text) {
        this.items = [text];
    },

    @action reset() {
        this.items = [];
    },

    items: asFlat([])
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
