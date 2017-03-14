import { observable, action, when } from 'mobx';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';
import { chatStore, contactStore } from '../../lib/icebear';

class ContactState {
    composeMessage() {
        routerModal.compose();
    }

    shareFile() {
        routerModal.shareFileTo();
    }

    @action exit() {
        routerModal.discard();
        this.clear();
    }

    @observable findUserText = '';
    @observable loading = false;
    @observable found = [];
    @observable recipients = [];
    @observable recipientsMap = observable.shallowMap();

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
        routerMain.suppressTransition = true;
        when(() => !routerMain.suppressTransition, () => this.clear());
        const chat = chatStore.startChat(recipient ? [recipient] : this.recipients);
        routerMain.chats(chat);
        when(() => !chat.loadingMeta, () => {
            this.exit();
            text && chat.sendMessage(text);
        });
    }

    @action sendTo(contact) {
        this.send(null, contact);
    }

    @action share() {
        // if (!mainState.currentFile) return;
        // const chat = chatStore.startChat(this.recipients);
        // mainState.chat(chat);
        // when(() => !chat.loadingMeta, () => chat.shareFiles([mainState.currentFile]));
        // this.exit();
    }
}

export default new ContactState();
