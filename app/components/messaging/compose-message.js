import React, { Component } from 'react';
import ContactSelector from '../contacts/contact-selector';
import { t } from '../utils/translator';

export default class ComposeMessage extends Component {
    render() {
        return (
            <ContactSelector action="send" title={t('chatWith')} />
        );
    }
}

