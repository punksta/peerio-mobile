import React, { Component } from 'react';
import ContactSelector from '../contacts/contact-selector';

export default class FileShare extends Component {
    render() {
        return (
            <ContactSelector action="share" title="Share with" />
        );
    }
}
