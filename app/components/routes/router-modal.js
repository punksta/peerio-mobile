import React from 'react';
import { observable, when } from 'mobx';
import Router from './router';
import ComposeMessage from '../messaging/compose-message';
import SelectFiles from '../files/select-files';
import FileShare from '../files/file-share';
import ContactView from '../contacts/contact-view';
import PinModalCreate from '../controls/pin-modal-create';
import routes from './routes';

class RouterModal extends Router {
    // TODO: get rid of it
    @observable modalControl = null;
    @observable animating = false;

    constructor() {
        super();
        routes.modal = this;
        this.add('compose', ComposeMessage);
        this.add('shareFileTo', FileShare);
        this.add('selectFiles', SelectFiles);
        this.add('contactView', ContactView);
        this.add('createPin', PinModalCreate, true);
    }

    add(route, component, isWhite) {
        const r = super.add(route, component).transition;
        r.isWhite = isWhite;
        this[route] = r;
    }

    waitFor() {
        return new Promise(resolve => when(() => !this.route && !this.modalControl, resolve));
    }

    discard() {
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
