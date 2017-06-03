import { observable, action, when, reaction } from 'mobx';
import { chatStore, clientApp } from '../../lib/icebear';
import RoutedState from '../routes/routed-state';
import contactState from '../contacts/contact-state';
import sounds from '../../lib/sounds';

class ChatState extends RoutedState {
    store = chatStore;
    _loading = true;

    constructor() {
        super();
        chatStore.events.on(chatStore.EVENT_TYPES.messagesReceived, () => {
            console.log('chat-state.js: messages received');
            sounds.received();
        });

        reaction(() => chatStore.activeChat, chat => {
            if (chat) {
                console.log(`chat-store switched to ${chat.id}`);
                console.log(`chat-store: loading ${chat.id}`);
                this.loading = false;
            }
        }, true);
    }

    @action async init() {
        this.store.loadAllChats();
        return new Promise(resolve => when(() => !this.store.loading, resolve));
    }

    get currentChat() {
        return chatStore.activeChat;
    }

    @observable _loading = true;

    get loading() {
        const c = this.currentChat;
        return this._loading ||
            chatStore.loading || c && (c.loadingMeta || c.loadingInitialPage);
    }

    set loading(v) {
        this._loading = v;
    }

    get title() {
        if (this.routerMain.currentIndex === 0) return 'Chats';
        return this.currentChat ? this.currentChat.name : '';
    }

    activate(chat) {
        if (chat.id) {
            console.log(`chat-state.js: activating chat ${chat.id}`);
            chatStore.activate(chat.id);
        }
    }

    onTransition(active, c) {
        console.log(`chat-state.js: loading all chats`);
        clientApp.isInChatsView = active && !!c;
        this.loading = c && c.loadingMeta;
        if (active) {
            when(() => !chatStore.loading, () => {
                if (!chatStore.chats.length) this.loading = false;
                c && this.activate(c);
                console.log(`chat-state.js: active: ${c.active}, isFocused: ${clientApp.isFocused}, isInChatsView: ${clientApp.isInChatsView}`);
            });
        }
    }

    get unreadMessages() {
        let r = 0;
        chatStore.chats.forEach(c => (r += c.unreadCount));
        return r;
    }

    get canSend() {
        return this.currentChat && this.currentChat.id &&
            !this.currentChat.loadingMessages;
    }

    get canSendAck() {
        return this.canSend && this.currentChat.canSendAck;
    }

    @action addMessage(msg, files) {
        this.currentChat && (
            files ? this.currentChat.shareFiles(files) : this.currentChat.sendMessage(msg)
        ).catch(sounds.destroy);
    }

    @action addAck() {
        this.currentChat && this.currentChat
            .sendAck().catch(sounds.destroy);
    }

    get titleAction() {
        if (this.routerMain.currentIndex === 0) return null;
        return this.currentChat ? (() => this.routerModal.chatInfo()) : null;
    }

    fabAction() {
        console.log(`chat-state.js: fab action`);
        contactState.composeMessage();
    }
}

export default new ChatState();
