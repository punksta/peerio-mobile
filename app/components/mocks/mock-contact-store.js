import React, { Component } from 'react';
import { View, Text, StatusBar, LayoutAnimation } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import randomWords from 'random-words';
import capitalize from 'capitalize';
import ComposeMessage from '../messaging/compose-message';
import CreateChannel from '../channels/create-channel';
import contactState from '../contacts/contact-state';
import { User } from '../../lib/icebear';

function createMockContact(username) {
    return {
        username,
        firstName: 'First',
        lastName: 'Last',
        fullName: 'First Last'
    };
}

const sampleSet = [
    createMockContact('seavan'),
    createMockContact('floh'),
    createMockContact('anri'),
    createMockContact('seavan'),
    createMockContact('oscar'),
    createMockContact('delhi'),
    createMockContact('paul'),
    createMockContact('saumya'),
    createMockContact('arthur'),
    createMockContact('armen'),
    createMockContact('ruben'),
    createMockContact('zaragoz'),
    createMockContact('eren'),
    createMockContact('skylar')
];

class MockContactStore {
    addedContacts = [];
    invitedContacts = [];
    contacts = sampleSet;

    constructor() {
        for (let i = 0; i < 15; ++i) {
            this.contacts.push(this.createMock());
        }
    }

    filter() {
        return sampleSet;
    }

    createMock() {
        const username = `un_${randomWords()}`;
        const firstName = capitalize(randomWords());
        const lastName = capitalize(randomWords());
        return {
            username,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`
        };
    }
}

export default new MockContactStore();
