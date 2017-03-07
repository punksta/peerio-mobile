import React, { Component } from 'react';
import ContactSelector from '../contacts/contact-selector';
import { t } from '../utils/translator';

export default class FileShare extends Component {
    render() {
        return (
            <ContactSelector action="share" title={t('contacts_shareWith')} />
        );
    }
}
