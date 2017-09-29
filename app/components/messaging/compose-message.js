import React, { Component } from 'react';
import ContactSelectorDM from '../contacts/contact-selector-dm';
import chatState from './chat-state';
import { tx } from '../utils/translator';

const LIMIT_PEOPLE = 1;

export default class ComposeMessage extends Component {
    render() {
        return (
            <ContactSelectorDM
                autoStart
                onExit={() => chatState.routerModal.discard()}
                action={contacts => chatState.startChat(contacts)}
                title={tx('title_newDirectMessage')} limit={LIMIT_PEOPLE} />
        );
    }
}
