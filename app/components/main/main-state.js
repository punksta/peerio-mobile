import { observable, action, when, reaction, computed } from 'mobx';
import state from '../layout/state';
import { chatStore } from '../../lib/icebear';
import store from '../../store/local-storage';

const mainState = observable({
    isBackVisible: false,
    isLeftMenuVisible: false,
    isRightMenuVisible: false,
    isInputVisible: false,
    blackStatusBar: false,
    route: null,
    currentChat: null,
    currentIndex: 0,
    showCompose: false,
    suppressTransition: false,
    suppressChatScroll: false,
    loading: false,

    @action initial() {
        state.hideKeyboard();
        this.isInputVisible = false;
        this.route = 'recent';
        this.currentIndex = 0;
        this.isBackVisible = false;
        this.load();
        when(() => !this.loading && !chatStore.loading, () => {
            let c = this.saved && chatStore.chatMap[this.saved.currentChat];
            if (!c && chatStore.chats.length) {
                c = chatStore.chats[chatStore.chats.length - 1];
            }

            this.showCompose = true;
            return;

            if (c) {
                this.chat(c);
            } else {
                this.showCompose = true;
            }
        });
        //
    },

    @action chat(i) {
        this.isLeftMenuVisible = false;
        this.isLeftMenuVisible = false;
        this.isInputVisible = true;
        this.route = 'chat';
        this.currentIndex = 0;
        this.showCompose = false;
        this.suppressChatScroll = true;
        // this.isBackVisible = true;
        this.currentChat = i;
        when(() => !i.loadingMeta, () => {
            this.currentChat.loadMessages();
            this.save();
        });
    },

    @action back() {
        this.recent();
    },

    @action async load() {
        this.loading = true;
        const s = await store.user.get('main-state');
        if (s) {
            this.saved = s;
        }
        this.loading = false;
    },

    @action async save() {
        await store.user.set('main-state', { currentChat: this.currentChat.id });
    },

    @computed get title() {
        const i = this.currentChat;
        return i && i.participants && i.participants.length ? i.participants.map(p => p.username).join(', ') : '';
    },

    @action addMessage(msg) {
        // this.chatItems.push(msg);
        mainState.currentChat && mainState.currentChat.sendMessage(msg);
    },

    @action toggleLeftMenu() {
        this.isLeftMenuVisible = !this.isLeftMenuVisible;
        this.isRightMenuVisible = false;
    },

    @action toggleRightMenu() {
        this.isRightMenuVisible = !this.isRightMenuVisible;
        this.isLeftMenuVisible = false;
    },

    chatItems: [
        { name: 'Alice', date: '2:23PM', message: 'Whoever sent me this prank box will suffer in hell, for sure' },
        { name: 'Bob', date: '2:24PM', message: 'That was not me' },
        { name: 'Alice',
            date: '2:25PM',
            message: `Are you sure?
            Because if it was you,
            I will find you,
            I will make you suffer,
            I will make you listen to
            Justin Bieber all your miserable
            remaining piece of life`
        },
        {
            name: 'Bob',
            date: '2:27PM',
            message: `Stop making a scene,
            darling. You do know I love Justin!`
        }
    ]
});

reaction(() => mainState.isLeftMenuVisible, () => {
    if (mainState.isLeftMenuVisible) state.hideKeyboard();
});

export default mainState;
