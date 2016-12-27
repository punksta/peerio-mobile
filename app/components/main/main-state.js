import { Animated } from 'react-native';
import { observable, action, when, reaction, asReference } from 'mobx';
import state from '../layout/state';
import { User, chatStore, fileStore } from '../../lib/icebear';
import store from '../../store/local-storage';
import sounds from '../../lib/sounds';
import { enablePushNotifications } from '../../lib/push';

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
    modalRoute: null,
    suppressTransition: false,
    _loading: false,

    get loading() {
        return this._loading || chatStore.loading; // || fileStore.loading;
    },

    set loading(v) {
        this._loading = v;
    },

    titles: asReference({
        recent: () => '',
        files: (s) => (s.currentFile ? s.currentFile.name : 'All files'),
        chat: (s) => (s.currentChat ? s.currentChat.chatName : '')
    }),

    @action activateAndTransition(user) {
        state.routes.main.transition();
        User.current = user;
        this.saveUser();
        store.openUserDb(user.username);
        chatStore.loadAllChats();
        when(() => !chatStore.loading, () => {
            console.log('main-state.js: load all files');
            fileStore.loadAllFiles();
        });
    },

    @action initial() {
        state.hideKeyboard();
        this.messages();
        this.load();

        chatStore.events.on(chatStore.EVENT_TYPES.messagesReceived, () => {
            sounds.received();
        });

        when(() => !this.loading, () => {
            let c = this.saved && chatStore.chatMap[this.saved.currentChat];
            if (!c && chatStore.chats.length) {
                c = chatStore.chats[chatStore.chats.length - 1];
            }

            if (c) {
                this.chat(c);
            }

            this.messages();

            if (__DEV__) {
                // this.showModal('shareFileTo');
                // this.showModal('selectFiles');
                // this.files();
            }

            enablePushNotifications();
            // make sure we loaded everything before requesting push permission
            when(() => !c || (!c.loadingMeta && !c.loadingMessages), () => {
                // enablePushNotifications();
            });
        });
        //
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

    @action messages() {
        this.resetMenus();
        this.route = this.currentChat ? 'chat' : 'recent';
        this.currentIndex = 0;
        this.isBackVisible = false;
    },

    get unreadMessages() {
        let r = 0;
        chatStore.chats.forEach(c => (r += c.unreadCount));
        return r;
    },

    @action resetMenus() {
        this.isInputVisible = false;
        this.isLeftMenuVisible = false;
        this.isRightMenuVisible = false;
        this.modalRoute = null;
    },

    @action files() {
        this.resetMenus();
        this.route = 'files';
        this.currentIndex = 0;
        this.currentFile = null;
        this.isBackVisible = false;
    },

    get fileCount() {
        return fileStore.files.length;
    },

    @action file(i) {
        this.route = 'files';
        this.currentFile = i;
        this.currentIndex = 1;
        this.isBackVisible = true;
    },

    @action downloadFile(i) {
        const file = i || this.currentFile;
        if (!file) return;
        if (file.downloading || file.uploading) return;
        file.download().catch(e => console.error(e));
    },

    @action deleteFile(i) {
        const f = i || this.currentFile;
        this.back();
        fileStore.remove(f);
    },

    @action back() {
        this.currentIndex = 0;
        this.currentFile = null;
        // this.currentChat = null;
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

    @action async saveUser() {
        await store.system.set('lastUsername', User.current.username);
    },

    @action async save() {
        await store.user.set('main-state', { currentChat: this.currentChat.id });
    },

    get title() {
        const t = this.titles[this.route];
        // console.log(`main-state.js: ${this.titles}, ${this.route}, ${t}`);
        // console.log(this.titles);
        return t && t(this);
    },

    get canSend() {
        return this.currentChat && this.currentChat.id &&
                      !this.currentChat.loadingMessages;
    },

    @action addMessage(msg) {
        sounds.sending();
        mainState.currentChat && mainState.currentChat
            .sendMessage(msg).then(sounds.sent).catch(sounds.destroy);
    },

    @action addAck() {
        sounds.ack();
        mainState.currentChat && mainState.currentChat
            .sendAck().then(sounds.sent).catch(sounds.destroy);
    },

    @action toggleLeftMenu() {
        state.hideKeyboard();
        this.isLeftMenuVisible = !this.isLeftMenuVisible;
        this.isRightMenuVisible = false;
    },

    @action toggleRightMenu() {
        state.hideKeyboard();
        this.isRightMenuVisible = !this.isRightMenuVisible;
        this.isLeftMenuVisible = false;
    },

    @action showModal(route) {
        this.modalRoute = route;
    },

    @action discardModal() {
        this.modalRoute = null;
    }
});

mainState.animatedLeftMenu = new Animated.Value(0);
mainState.animatedLeftMenuWidth = new Animated.Value(0);

reaction(() => mainState.isLeftMenuVisible, () => {
    if (mainState.isLeftMenuVisible) state.hideKeyboard();
});

export default mainState;
