import { observable, action, when, asMap } from 'mobx';
import mainState from '../main/main-state';
import { chatStore } from '../../lib/icebear';

const messagingState = observable({
    @action chat(v) {
        mainState.showCompose = false;
        mainState.chat(v);
        this.exit();
    },

    @action transition() {
        mainState.showCompose = true;
    },

    @action exit() {
        mainState.showCompose = false;
        this.clear();
    },

    findUserText: '',
    loading: false,
    recipients: [],
    recipientsMap: asMap(),

    findByUsername(username) {
        return this.recipients.filter(i => i.username === username);
    },

    exists(c) {
        return !!this.findByUsername(c.username).length;
    },

    @action add(c) {
        if (this.exists(c)) return;
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
        this.recipientsMap.clear();
    },

    @action send(text, recipient) {
        mainState.suppressTransition = true;
        when(() => !mainState.suppressTransition, () => this.clear());
        const chat = chatStore.startChat(recipient ? [recipient] : this.recipients);
        this.chat(chat);
        when(() => chat.id, () => {
            text && chat.sendMessage(text);
        });
    },

    @action sendTo(contact) {
        this.send(null, contact);
    }
});

export default messagingState;

this.Peerio = this.Peerio || {};
this.Peerio.messagingState = messagingState;

