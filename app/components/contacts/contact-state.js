import { observable, action, when } from 'mobx';
import RoutedState from '../routes/routed-state';
import { contactStore } from '../../lib/icebear';
import fileState from '../files/file-state';
import chatState from '../messaging/chat-state';

class ContactState extends RoutedState {
    _prefix = 'contacts';
    store = contactStore;

    @action async init() {
        return new Promise(resolve => when(() => !this.store.loading, resolve));
    }

    composeMessage() {
        this.routerModal.compose();
    }

    shareFile() {
        this.routerModal.shareFileTo();
    }

    @action exit() {
        this.routerModal.discard();
        this.clear();
    }

    @observable currentContact = null;
    @observable findUserText = process.env.PEERIO_SEARCH_USERNAME || '';
    @observable loading = false;
    @observable found = [];
    @observable recipients = [];
    @observable recipientsMap = observable.shallowMap();


    @action contactView(contact) {
        this.routerMain.resetMenus();
        this.currentContact = contact;
        this.routerModal.contactView();
    }

    findByUsername(username) {
        return this.recipients.filter(i => i.username === username);
    }

    exists(c) {
        return !!this.findByUsername(c.username).length;
    }

    get filtered() {
        const result = contactStore.contacts.filter(
            c => !c.loading && !c.notFound && c.username.startsWith(this.findUserText)
        );
        return result.length ? result : this.found.filter(c => !c.loading && !c.notFound);
    }

    @action add(c) {
        if (this.exists(c)) return;
        this.findUserText = '';
        this.recipients.push(c);
        this.recipientsMap.set(c.username, c);
    }

    @action remove(c) {
        const existing = this.findByUsername(c.username);
        existing.forEach(e => {
            const i = this.recipients.indexOf(e);
            if (i === -1) return;
            this.recipients.splice(i, 1);
        });
        this.recipientsMap.delete(c.username);
    }

    @action toggle(c) {
        this.exists(c) ? this.remove(c) : this.add(c);
    }

    @action clear() {
        this.loading = false;
        this.findUserText = '';
        this.recipients = [];
        this.found = [];
        this.recipientsMap.clear();
    }

    @action send(text, recipient) {
        this.routerMain.suppressTransition = true;
        when(() => !this.routerMain.suppressTransition, () => this.clear());
        const chat = chatState.store.startChat(recipient ? [recipient] : this.recipients);
        this.routerMain.chats(chat);
        when(() => !chat.loadingMeta, () => {
            this.exit();
            text && chat.sendMessage(text);
        });
    }

    @action sendTo(contact) {
        this.send(null, contact);
    }

    @action share() {
        if (!fileState.currentFile) return;
        const file = fileState.currentFile;
        this.recipients.forEach(username => file.share(username));
        this.exit();
    }
}

export default new ContactState();
