import { observable, action, when } from 'mobx';
import { chatStore } from '../../lib/icebear';
import sounds from '../../lib/sounds';

const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';

class ChatState {
    @observable _loading = false;

    get loading() {
        return this._loading || chatStore.loading; // || fileStore.loading;
    }

    set loading(v) {
        this._loading = v;
    }

    get title() {

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

    @action messages() {
        this.resetMenus();
        this.route = this.currentChat ? 'chat' : 'recent';
        this.currentIndex = 0;
        this.isBackVisible = false;
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
}

export default new ChatState();
