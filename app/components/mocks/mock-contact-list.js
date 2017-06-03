import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import ContactList from '../contacts/contact-list';
import ContactsPlaceholder from '../contacts/contacts-placeholder';
import SafeComponent from '../shared/safe-component';

@observer
export default class MockContactList extends SafeComponent {
    renderThrow() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <ContactsPlaceholder />
            </View>
        );
    }
}
