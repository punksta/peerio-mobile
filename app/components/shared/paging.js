import { observable, reaction } from 'mobx';
import mainState from '../main/main-state';

export default class Paging {
    renderCount = 1;
    lastChat = null;
    @observable _data = [];

    constructor() {
        reaction(() => mainState.currentChat, chat => {
            if (chat !== this.lastChat) {
                this.lastChat = [];
                this.renderCount = 0;
                this._data = [];
                this.loadNext();
            }
        });
        reaction(() => this.source.length, () => this.updateFrame());
    }

    updateFrame() {
        this._data = this.source.slice(-this.renderCount);
    }

    get hasMore() {
        return this.source.length > this._data.length;
    }

    get source() {
        return (mainState.currentChat && mainState.currentChat.messages) || [];
    }

    loadNext(count) {
        const loadSize = count || 10;
        const s = this.source;
        if (s.length <= this.renderCount) return;
        this.renderCount = Math.min(s.length, this.renderCount + loadSize);
        this.updateFrame();
    }

    get data() {
        return this._data;
    }
}
