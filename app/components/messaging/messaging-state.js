import { observable, action, when } from 'mobx';
import mainState from '../main/main-state';
import { chatStore } from '../../lib/icebear';

const messagingState = observable({
    @action chat(v) {
        mainState.showCompose = false;
        mainState.chat(v);
        this.exit();
    },

    @action transition() {
        mainState.currentChat = null;
        mainState.showCompose = true;
    },

    @action exit() {
        mainState.showCompose = false;
        this.clear();
    },

    currentChat: null,
    findUserText: '',
    loading: false,
    recipients: [],

    @action clear() {
        this.loading = false;
        this.currentChat = null;
        this.findUserText = '';
        this.recipients = [];
    },

    @action send(text, recipient) {
        mainState.suppressTransition = true;
        when(() => !mainState.suppressTransition, () => this.clear());
        const chat = chatStore.startChat(recipient ? [recipient] : this.recipients);
        when(() => chat.id, () => {
            text && chat.sendMessage(text);
            messagingState.chat(chat);
        });
    },

    @action sendTo(contact) {
        this.send(null, contact);
    }
});

export default messagingState;

this.Peerio = this.Peerio || {};
this.Peerio.messagingState = messagingState;

