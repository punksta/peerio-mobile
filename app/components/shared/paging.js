import { observable, reaction } from 'mobx';
import mainState from '../main/main-state';

export default class Paging {
    renderCount = 1;
    lastChat = null;
    lastLength = 0;
    @observable _data = [];

    constructor() {
        reaction(() => mainState.currentChat, chat => {
            console.log(`paging.js: chat changed`);
            if (chat !== this.lastChat) {
                this.lastChat = [];
                this.renderCount = 1;
                this._data = [];
                this.lastLength = chat.messages.length;
                this.updateFrame();
                // this.loadNext();

                if (this.subscription) {
                    this.subscription();
                    this.subscription = null;
                }
                this.subscription = reaction(() => chat.messages.length, l => {
                    const delta = l - this.lastLength;
                    if (delta) {
                        console.log(`paging.js: ${this.renderCount}`);
                        this.renderCount += Math.min(delta, 10);
                    }
                    this.lastLength = l;
                    this.updateFrame();
                });
            }
        }, true);
    }

    updateFrame() {
        console.log(`paging.js: ${this.renderCount}`);
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
