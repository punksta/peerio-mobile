import React from 'react';
import { observable, reaction, action } from 'mobx';
import Router from './router';
import ComposeMessage from '../messaging/compose-message';
import SelectFiles from '../files/select-files';
import FileShare from '../files/file-share';
import ContactView from '../contacts/contact-view';

class RouterModal extends Router {
    // TODO: get rid of it
    @observable modalControl = null;

    constructor() {
        super();
        this.add('compose', ComposeMessage);
        this.add('shareFileTo', FileShare);
        this.add('selectFiles', SelectFiles);
        this.add('contactView', ContactView);
    }

    add(route, component) {
        this[route] = super.add(route, component).transition;
    }

    discard() {
        this.route = null;
    }

    get modal() {
        return this.current ? React.createElement(this.current.component) : null;
    }
}

export default new RouterModal();
