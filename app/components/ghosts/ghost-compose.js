import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import ContactSelector from '../contacts/contact-selector';

export default class ComposeMessage extends Component {
    render() {
        return (
            <ContactSelector action="send" title="New message" />
        );
    }
}

