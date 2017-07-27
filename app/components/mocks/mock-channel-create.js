import React, { Component } from 'react';
import { View, Text, StatusBar, LayoutAnimation } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
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
    filter() {
        return sampleSet;
    }
}

@observer
export default class MockChannelCreate extends Component {
    @observable isChatMode = true;

    componentDidMount() {
        reaction(() => this.isChatMode, () => LayoutAnimation.easeInEaseOut());
        User.current = {};
        contactState.store = new MockContactStore();
    }

    createChannel = () => { this.isChatMode = false; }

    createChat = () => { this.isChatMode = true; }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                {this.isChatMode ?
                    <ComposeMessage createChannel={this.createChannel} /> :
                    <CreateChannel createChat={this.createChat} />}
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
