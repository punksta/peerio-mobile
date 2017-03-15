import { observable, action, reaction } from 'mobx';
import { systemWarnings } from '../../lib/icebear';
import { popupYes } from '../shared/popups';
import { t } from '../utils/translator';

class SnackBarState {
    @observable items = [];

    get text() {
        return this.items.length ?
            this.items[this.items.length - 1].text : null;
    }

    @action push(text, callback) {
        this.items.push({ text, callback });
    }

    @action pushTemporary(text) {
        const item = { text };
        this.items.push(item);
        setTimeout(() => {
            const i = this.items.indexOf(item);
            if (i !== -1) this.items.splice(i, 1);
        }, 3000);
    }

    @action pop() {
        if (!this.items.length) return;
        const i = this.items[this.items.length - 1];
        const _pop = () => (this.items.length && this.items.splice(-1));
        i.callback && i.callback();
        _pop();
    }

    @action set(text) {
        this.items.clear();
        this.items.push(text);
    }

    @action reset() {
        this.items.clear();
    }
}

const snackbarState = new SnackBarState();

reaction(() => systemWarnings.collection.length, (l) => {
    console.log('snackbar-state.js: server warning update');
    if (l) {
        const sw = systemWarnings.collection[l - 1];
        if (sw.level === 'severe') {
            // TODO: add custom button support
            popupYes(t(sw.title), t(sw.content));
        } else {
            snackbarState.push(t(sw.content), () => {
                console.log('snackbar-state.js: server warning cleared');
                sw && sw.action && sw.action();
            });
        }
    }
});

// systemWarnings.addLocalWarningSevere('ghosts_quotaExceeded', 'ghosts_sendingError');

export default snackbarState;
