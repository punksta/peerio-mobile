import { observable, action, when, reaction, computed, asReference } from 'mobx';
import state from '../layout/state';
import { User, chatStore, fileStore } from '../../lib/icebear';
import store from '../../store/local-storage';

const mainState = observable({
    isBackVisible: false,
    isLeftMenuVisible: false,
    isRightMenuVisible: false,
    isInputVisible: false,
    blackStatusBar: false,
    route: null,
    currentChat: null,
    currentFile: null,
    currentIndex: 0,
    showCompose: false,
    suppressTransition: false,
    loading: false,

    titles: asReference({
        recent: () => '',
        files: () => 'Files',
        chat: (s) => (s.currentChat ? s.currentChat.chatName : '')
    }),

    @action activateAndTransition(user) {
        state.routes.main.transition();
        User.current = user;
        store.openUserDb(user.username);
        chatStore.loadAllChats();
        fileStore.loadAllFiles();
    },

    @action initial() {
        state.hideKeyboard();
        this.messages();
        this.load();
        when(() => !this.loading && !chatStore.loading, () => {
            let c = this.saved && chatStore.chatMap[this.saved.currentChat];
            if (!c && chatStore.chats.length) {
                c = chatStore.chats[chatStore.chats.length - 1];
            }

            if (c) {
                this.chat(c);
            } else {
                this.showCompose = true;
            }

            if (__DEV__) {
                // this.files();
                // this.showCompose = true;
            }
        });
        //
    },

    @action messages() {
        this.resetMenus();
        this.route = 'recent';
        this.currentIndex = 0;
        this.isBackVisible = false;
    },

    @action resetMenus() {
        this.isInputVisible = false;
        this.isLeftMenuVisible = false;
        this.isRightMenuVisible = false;
        this.showCompose = false;
    },

    @action files() {
        this.resetMenus();
        this.route = 'files';
        this.currentIndex = 0;
        this.currentFile = null;
        this.isBackVisible = false;
    },

    @action file(i) {
        this.route = 'files';
        this.currentFile = i;
        this.currentIndex = 1;
        this.isBackVisible = true;
    },

    @action chat(i) {
        this.resetMenus();
        this.isInputVisible = true;
        this.route = 'chat';
        this.currentIndex = 0;
        this.currentChat = i;
        chatStore.activate(i.id);
        when(() => !i.loadingMeta, () => {
            this.currentChat.loadMessages();
            this.save();
        });
    },

    @action back() {
        this.currentIndex = 0;
        this.isBackVisible = false;
    },

    @action async load() {
        console.log('main-state.js: loading');
        this.loading = true;
        const s = await store.user.get('main-state');
        if (s) {
            this.saved = s;
        }
        this.loading = false;
        console.log('main-state.js: loaded');
    },

    @action async save() {
        await store.user.set('main-state', { currentChat: this.currentChat.id });
    },

    @computed get title() {
        const t = this.titles[this.route];
        // console.log(`main-state.js: ${this.titles}, ${this.route}, ${t}`);
        // console.log(this.titles);
        return t && t(this);
    },

    @computed get canSend() {
        return this.currentChat && this.currentChat.id &&
                      !this.currentChat.loadingMessages;
    },

    @action addMessage(msg) {
        mainState.currentChat && mainState.currentChat.sendMessage(msg);
    },

    @action addAck() {
        mainState.currentChat && mainState.currentChat.sendAck();
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
