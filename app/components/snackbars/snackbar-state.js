import { observable, action, observe, when } from 'mobx';
import { systemWarnings, socket } from '../../lib/icebear';
import { popupYes, popupSystemWarning } from '../shared/popups';
import { t, tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';
import tagify from '../shared/tagify';

class SnackBarState extends RoutedState {
    @observable items = [];

    constructor(props) {
        super(props);
        observe(systemWarnings.collection, change => {
            console.log('snackbar-state.js: server warning update');
            const add = sw => when(() => !this.isInProgress, () => {
                const swAction = () => sw && sw.action && sw.action();
                if (sw.level === 'severe') {
                    popupSystemWarning(tx(sw.title), tagify(tx(sw.content)), sw.buttons).then(swAction);
                } else {
                    this.push(t(sw.content), swAction);
                }
            });
            change.added && change.added.length && change.added.forEach(add);
        });
    }

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
// systemWarnings.addLocalWarningSevere('ghosts_quotaExceeded', 'ghosts_sendingError');
when(() => socket.throttled, () => {
    popupYes('Authentication error', '425 Throttled', 'Your account has been throttled due to unusual activity')
        .then(() => (socket.throttled = false));
});

export default snackbarState;
