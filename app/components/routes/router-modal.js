import React from 'react';
import { observable } from 'mobx';
import Router from './router';
import ComposeMessage from '../messaging/compose-message';
import SelectFiles from '../files/select-files';
import FileShare from '../files/file-share';
import ContactView from '../contacts/contact-view';
import ChatInfo from '../messaging/chat-info';
import PinModalCreate from '../controls/pin-modal-create';
import PinModalAsk from '../controls/pin-modal-ask';
import routes from './routes';

class RouterModal extends Router {
    @observable animating = false;
    resolver = null;

    constructor() {
        super();
        routes.modal = this;
        this.add('compose', ComposeMessage);
        this.add('shareFileTo', FileShare);
        this.add('selectFiles', SelectFiles);
        this.add('contactView', ContactView);
        this.add('createPin', PinModalCreate, true);
        this.add('askPin', PinModalAsk, true);
        this.add('chatInfo', ChatInfo);
    }

    add(route, component, isWhite) {
        const r = super.add(route, component);
        r.isWhite = isWhite;
        this[route] = () => {
            this.flushResolver();
            r.transition();
            return new Promise(resolve => {
                this.resolver = resolve;
            });
        };
    }

    flushResolver(value) {
        if (this.resolver) {
            console.log('router-modal.js: auto-resolving unclosed resolver');
            this.resolver(value);
            this.resolver = null;
        }
    }

    discard(value) {
        this.flushResolver(value);
        this.route = null;
    }

    get isBlackStatusBar() {
        return !this.animating && this.current && !this.current.isWhite;
    }

    get modal() {
        return this.current ? React.createElement(this.current.component) : null;
    }
}

export default new RouterModal();
