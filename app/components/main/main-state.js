import React from 'react';
import { Animated, Platform } from 'react-native';
import { observable, action, when, reaction } from 'mobx';
import uiState from '../layout/ui-state';
import { User, chatStore, fileStore, mailStore, contactStore, TinyDb } from '../../lib/icebear';
import sounds from '../../lib/sounds';
import { enablePushNotifications } from '../../lib/push';
import touchid from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import PinModalCreate from '../controls/pin-modal-create';
import { tx } from '../utils/translator';
import routerApp from '../routes/router-app';

const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';

class MainState {
    @observable modalRoute = null;
    @observable modalControl = null;
    @observable _loading = false;

    get loading() {
        return this._loading || chatStore.loading; // || fileStore.loading;
    }

    set loading(v) {
        this._loading = v;
    }

    // extended by specific states (file-state, messaging-state)
    titles = observable.ref({
        recent: () => '',
        files: (s) => (s.currentFile ? s.currentFile.name : tx('files_allFiles')),
        chat: (s) => (s.currentChat ? s.currentChat.chatName : '')
    });

    // extended by specific states (file-state, messaging-state)
    fabActions = observable.ref({});

    @action activateAndTransition(user) {
        const pinModal = () => (
            <PinModalCreate
                title="Create device PIN"
                onSuccess={pin => User.current.setPasscode(pin)} />
        );
        // if (__DEV__) mainState.modalControl = pinModal;
        routerApp.routes.main.transition();
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
    }

    @action initial() {
        uiState.hideKeyboard();
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
                    this.route = process.env.PEERIO_DEFAULT_ROUTE;
                }
            }

            // enablePushNotifications();
            // make sure we loaded everything before requesting push permission
            when(() => !c || (!c.loadingMeta && !c.loadingMessages), () => {
                (EN === 'peeriomobile') && enablePushNotifications();
            });
        });
        //
    }

    @action chat(i) {
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
    }

    get fileCount() {
        return fileStore.files.length;
    }

    @action file(i) {
        this.route = 'files';
        this.currentFile = i;
        this.currentIndex = 1;
        this.isBackVisible = true;
    }

    @action downloadFile(i) {
        const file = i || this.currentFile;
        if (!file) return;
        if (file.downloading || file.uploading) return;
        file.download().catch(e => console.error(e));
    }

    @action deleteFile(i) {
        const f = i || this.currentFile;
        this.back();
        fileStore.remove(f);
    }

    @action back() {
        this.currentIndex--;
        this.currentFile = null;
        // this.currentChat = null;
        this.isBackVisible = this.currentIndex > 0;
    }

    @action async load() {
        console.log('main-state.js: loading');
        this.loading = true;
        const s = await TinyDb.user.getValue('main-state');
        if (s) {
            this.saved = s;
        }
        this.loading = false;
        console.log('main-state.js: loaded');
    }

    @action async saveUser() {
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
    }

    @action async save() {
        await TinyDb.user.setValue('main-state', { currentChat: this.currentChat.id });
    }

    get title() {
        const t = this.titles[this.route];
        // console.log(`main-state.js: ${this.titles}, ${this.route}, ${t}`);
        // console.log(this.titles);
        return t && t(this);
    }

    get canSend() {
        return this.currentChat && this.currentChat.id &&
                      !this.currentChat.loadingMessages;
    }

    @action addMessage(msg, files) {
        sounds.sending();
        this.currentChat && (
            files ? this.currentChat.shareFiles(files) : this.currentChat.sendMessage(msg)
        ).then(sounds.sent).catch(sounds.destroy);
    }

    @action addAck() {
        sounds.ack();
        this.currentChat && this.currentChat
            .sendAck().then(sounds.sent).catch(sounds.destroy);
    }

    @action showModal(route) {
        this.modalRoute = route;
    }

    @action discardModal() {
        this.modalRoute = null;
    }

    @action contactView(contact) {
        this.resetMenus();
        this.currentContact = contact;
        this.showModal('contactView');
    }
}

const mainState = new MainState();

// mainState.showPopup({
//     title: tx('passphrase'),
//     text: 'blue zeppelin runs aboard all',
//     buttons: [
//         { id: 'skip', text: tx('button_skip') },
//         { id: 'use', text: tx('button_useQR') }
//     ]
// });

export default mainState;
