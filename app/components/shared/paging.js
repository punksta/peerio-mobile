import { observable, reaction } from 'mobx';
import chatState from '../messaging/chat-state';

export default class Paging {
    renderCount = 1;
    lastChat = null;
    lastLength = 0;

    get chat() {
        return chatState.currentChat;
    }

    updateFrame() {
        // console.log(`paging.js: ${this.renderCount}`);
        // this._data = this.source.slice(-this.renderCount);
    }

    get canGoUp() {
        return this.chat && this.chat.canGoUp;
    }

    get loadingTopPage() {
        return this.chat && this.chat.loadingTopPage;
    }

    get canGoDown() {
        return this.chat && this.chat.canGoDown;
    }

    get loadingBottomPage() {
        return this.chat && this.chat.loadingBottomPage;
    }

    get loading() {
        return chatState.loading || (this.chat && this.chat.loadingMeta);
    }

    loadPreviousPage() {
        this.chat && this.chat.loadPreviousPage();
    }

    get data() {
        return this.chat ? this.chat.messages : null;
    }
}
