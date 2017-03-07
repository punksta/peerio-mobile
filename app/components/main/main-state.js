import { Animated, Platform } from 'react-native';
import { observable, action, when, reaction } from 'mobx';
import state from '../layout/state';
import { User, chatStore, fileStore, mailStore, contactStore, TinyDb } from '../../lib/icebear';
import sounds from '../../lib/sounds';
import { enablePushNotifications } from '../../lib/push';
import touchid from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { tx } from '../utils/translator';

const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';

const mainState = observable({
    isLeftHamburgerVisible: true,
    isBackVisible: false,
    isLeftMenuVisible: false,
    isRightMenuVisible: false,
    isInputVisible: false,
    blackStatusBar: false,
    route: null,
    currentChat: null,
    currentFile: null,
    currentContact: null,
    currentIndex: 0,
    modalRoute: null,
    modalControl: null,
    suppressTransition: false,
    _loading: false,

    get loading() {
        return this._loading || chatStore.loading; // || fileStore.loading;
    },

    set loading(v) {
        this._loading = v;
    },

    // extended by specific states (file-state, messaging-state)
    titles: observable.ref({
        recent: () => '',
        files: (s) => (s.currentFile ? s.currentFile.name : tx('files_allFiles')),
        chat: (s) => (s.currentChat ? s.currentChat.chatName : '')
    }),

    // extended by specific states (file-state, messaging-state)
    fabActions: observable.ref({}),

    activateAndTransition: action.bound(function(user) {
        state.routes.main.transition();
        User.current = user;
        this.saveUser();
        // store.openUserDb(user.username);
        chatStore.loadAllChats();
        when(() => !chatStore.loading, () => {
            console.log('main-state.js: load all files');
            fileStore.loadAllFiles();
            contactStore.loadLegacyContacts();
            when(() => !fileStore.loading, () => mailStore.loadAllGhosts());
        });
    }),

    initial: action.bound(function() {
        state.hideKeyboard();
        this.messages();
        this.load();

        chatStore.events.on(chatStore.EVENT_TYPES.messagesReceived, () => {
            console.log('main-state.js: messages received');
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
                if (process.env.PEERIO_DEFAULT_ROUTE) {
                    mainState.route = process.env.PEERIO_DEFAULT_ROUTE;
                }
                // this.showModal('shareFileTo');
                // this.showModal('selectFiles');
                // this.files();
            }

            // enablePushNotifications();
            // make sure we loaded everything before requesting push permission
            when(() => !c || (!c.loadingMeta && !c.loadingMessages), () => {
                (EN === 'peeriomobile') && enablePushNotifications();
            });
        });
        //
    }),

    chat: action.bound(function(i) {
        this.resetMenus();
        this.isInputVisible = true;
        this.route = 'chat';
        this.currentIndex = 0;
        this.currentChat = i;
        chatStore.activate(i.id);
        this._loading = !i.messagesLoaded;
        when(() => !i.loadingMeta, () => {
            setTimeout(() => {
                i.loadMessages();
                this.save();
                when(() => !i.loadingMessages, () => (this._loading = false));
            }, i.messagesLoaded ? 0 : 500);
        });
    }),

    messages: action(function() {
        this.resetMenus();
        this.route = this.currentChat ? 'chat' : 'recent';
        this.currentIndex = 0;
        this.isBackVisible = false;
    }),

    get unreadMessages() {
        let r = 0;
        chatStore.chats.forEach(c => (r += c.unreadCount));
        return r;
    },

    resetMenus: action.bound(function() {
        this.isInputVisible = false;
        this.isLeftMenuVisible = false;
        this.isRightMenuVisible = false;
        this.isLeftHamburgerVisible = true;
        this.modalRoute = null;
    }),

    files: action.bound(function() {
        this.resetMenus();
        this.suppressTransition = Platform.OS === 'android';
        this.route = 'files';
        this.currentIndex = 0;
        this.currentFile = null;
        this.isBackVisible = false;
    }),

    get fileCount() {
        return fileStore.files.length;
    },

    file: action.bound(function(i) {
        this.route = 'files';
        this.currentFile = i;
        this.currentIndex = 1;
        this.isBackVisible = true;
    }),

    downloadFile: action.bound(function(i) {
        const file = i || this.currentFile;
        if (!file) return;
        if (file.downloading || file.uploading) return;
        file.download().catch(e => console.error(e));
    }),

    deleteFile: action.bound(function(i) {
        const f = i || this.currentFile;
        this.back();
        fileStore.remove(f);
    }),

    back: action.bound(function() {
        this.currentIndex--;
        this.currentFile = null;
        // this.currentChat = null;
        this.isBackVisible = this.currentIndex > 0;
    }),

    load: action.bound(async function() {
        console.log('main-state.js: loading');
        this.loading = true;
        const s = await TinyDb.user.getValue('main-state');
        if (s) {
            this.saved = s;
        }
        this.loading = false;
        console.log('main-state.js: loaded');
    }),

    saveUser: action.bound(async function() {
        const user = User.current;
        await TinyDb.system.setValue('lastUsername', user.username);
        const skipTouchID = `${user.username}::skipTouchID`;
        const skipTouchIDValue = await TinyDb.system.getValue(skipTouchID);
        await touchid.load();
        !skipTouchIDValue && touchid.available && TinyDb.system.getValue(`user::${user.username}::touchid`)
            .then(result => {
                if (!result) {
                    console.log('main-state.js: touch id available but value not set');
                    console.log('main-state.js: saving');
                    rnAlertYesNo(tx('touchId'), tx('setup_touchTitle'))
                        .then(() => {
                            TinyDb.system.setValue(`user::${user.username}::touchid`, true);
                            return touchid.save(`user::${user.username}`, user.serializeAuthData());
                        })
                        .catch(() => {
                            console.log('main-state.js: user cancel touch id');
                            return TinyDb.system.setValue(skipTouchID, true);
                        });
                }
                console.log('main-state.js: touch id available and value is set');
            });
    }),

    save: action.bound(async function() {
        await TinyDb.user.setValue('main-state', { currentChat: this.currentChat.id });
    }),

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

    addMessage: action.bound(function(msg, files) {
        sounds.sending();
        this.currentChat && (
            files ? this.currentChat.shareFiles(files) : this.currentChat.sendMessage(msg)
        ).then(sounds.sent).catch(sounds.destroy);
    }),

    addAck: action.bound(function() {
        sounds.ack();
        this.currentChat && this.currentChat
            .sendAck().then(sounds.sent).catch(sounds.destroy);
    }),

    toggleLeftMenu: action.bound(function() {
        state.hideKeyboard();
        this.isLeftMenuVisible = !this.isLeftMenuVisible;
        this.isRightMenuVisible = false;
    }),

    toggleRightMenu: action.bound(function() {
        state.hideKeyboard();
        this.isRightMenuVisible = !this.isRightMenuVisible;
        this.isLeftMenuVisible = false;
    }),

    showModal: action.bound(function(route) {
        this.modalRoute = route;
    }),

    discardModal: action.bound(function() {
        this.modalRoute = null;
    }),

    logs: action.bound(function() {
        this.resetMenus();
        this.route = 'logs';
    }),

    contactView: action.bound(function(contact) {
        this.resetMenus();
        this.currentContact = contact;
        this.showModal('contactView');
    }),

    fabAction: action.bound(function() {
        const fa = this.fabActions[this.route];
        fa && fa();
    })
});

mainState.animatedLeftMenu = new Animated.Value(0);
mainState.animatedLeftMenuWidth = new Animated.Value(0);

reaction(() => mainState.isLeftMenuVisible, () => {
    if (mainState.isLeftMenuVisible) state.hideKeyboard();
});

reaction(() => mainState.route === 'files', files => {
    fileStore.active = files;
});

// mainState.showPopup({
//     title: tx('passphrase'),
//     text: 'blue zeppelin runs aboard all',
//     buttons: [
//         { id: 'skip', text: tx('button_skip') },
//         { id: 'use', text: tx('button_useQR') }
//     ]
// });

export default mainState;
