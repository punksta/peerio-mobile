import { observable, action, when } from 'mobx';
import mainState from '../main/main-state';
import { chatStore, contactStore } from '../../lib/icebear';

const contactState = observable({
    composeMessage() {
        mainState.showModal('compose');
    },

    shareFile() {
        mainState.showModal('shareFileTo');
    },

    exit: action.bound(function() {
        mainState.discardModal();
        this.clear();
    }),

    findUserText: '',
    loading: false,
    found: [],
    recipients: [],
    recipientsMap: observable.shallowMap(),

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

    add: action.bound(function(c) {
        if (this.exists(c)) return;
        this.findUserText = '';
        this.recipients.push(c);
        this.recipientsMap.set(c.username, c);
    }),

    remove: action.bound(function(c) {
        const existing = this.findByUsername(c.username);
        existing.forEach(e => {
            const i = this.recipients.indexOf(e);
            if (i === -1) return;
            this.recipients.splice(i, 1);
        });
        this.recipientsMap.delete(c.username);
    }),

    toggle: action.bound(function(c) {
        this.exists(c) ? this.remove(c) : this.add(c);
    }),

    clear: action.bound(function() {
        this.loading = false;
        this.findUserText = '';
        this.recipients = [];
        this.found = [];
        this.recipientsMap.clear();
    }),

    send: action.bound(function(text, recipient, files) {
        mainState.suppressTransition = true;
        when(() => !mainState.suppressTransition, () => this.clear());
        const chat = chatStore.startChat(recipient ? [recipient] : this.recipients);
        mainState.chat(chat);
        this.exit();
        when(() => chat.id, () => {
            //todo: Samvel, i'm not sure while files are even passed here if you check for text existense
            // but i left it safe (behaving the same way) just in case
            text && (files ? chat.shareFiles(files) : chat.sendMessage(text));
        });
    }),

    sendTo: action.bound(function(contact) {
        this.send(null, contact);
    }),

    share: action.bound(function() {
        if (!mainState.currentFile) return;
        const chat = chatStore.startChat(this.recipients);
        mainState.chat(chat);
        when(() => !chat.loadingMeta, () => chat.shareFiles([mainState.currentFile]));
        this.exit();
    })
});

export default contactState;

this.Peerio = this.Peerio || {};
this.Peerio.contactState = contactState;

