import { observable, action, when, asMap } from 'mobx';
import mainState from '../main/main-state';
import { chatStore, contactStore } from '../../lib/icebear';

const contactState = observable({
    @action composeMessage() {
        mainState.showModal('compose');
    },

    @action shareFile() {
        mainState.showModal('shareFileTo');
    },

    @action exit() {
        mainState.discardModal();
        this.clear();
    },

    findUserText: '',
    loading: false,
    found: [],
    recipients: [],
    recipientsMap: asMap(),

    findByUsername(username) {
        return this.recipients.filter(i => i.username === username);
    },

    exists(c) {
        return !!this.findByUsername(c.username).length;
    },

    get filtered() {
        const result = contactStore.contacts.filter(
            c => !c.loading && !c.notFound && c.username.startsWith(this.findUserText)
        );
        return result.length ? result : this.found.filter(c => !c.loading && !c.notFound);
    },

    @action add(c) {
        if (this.exists(c)) return;
        this.findUserText = '';
        this.recipients.push(c);
        this.recipientsMap.set(c.username, c);
    },

    @action remove(c) {
        const existing = this.findByUsername(c.username);
        existing.forEach(e => {
            const i = this.recipients.indexOf(e);
            if (i === -1) return;
            this.recipients.splice(i, 1);
        });
        this.recipientsMap.delete(c.username);
    },

    @action toggle(c) {
        this.exists(c) ? this.remove(c) : this.add(c);
    },

    @action clear() {
        this.loading = false;
        this.findUserText = '';
        this.recipients = [];
        this.found = [];
        this.recipientsMap.clear();
    },

    @action send(text, recipient, files) {
        mainState.suppressTransition = true;
        when(() => !mainState.suppressTransition, () => this.clear());
        const chat = chatStore.startChat(recipient ? [recipient] : this.recipients);
        mainState.chat(chat);
        this.exit();
        when(() => chat.id, () => {
            text && chat.sendMessage(text, files);
        });
    },

    @action sendTo(contact) {
        this.send(null, contact);
    },

    @action share() {
        if (!mainState.currentFile) return;
        // todo replace this with new sharing api when server implements it
        const chat = chatStore.startChat(this.recipients);
        mainState.chat(chat);
        when(() => !chat.loadingMeta, () => chat.sendMessage('', [mainState.currentFile]));
        this.exit();
    }
});

export default contactState;

this.Peerio = this.Peerio || {};
this.Peerio.contactState = contactState;

