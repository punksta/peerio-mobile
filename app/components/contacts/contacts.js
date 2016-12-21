import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { contactStore } from '../../lib/icebear';
import contactState from './contact-state';
import styles from '../../styles/styles';

export default class Contacts extends Component {
    render() {
        const itemsMap = {};
        const cachedContacts = contactStore.contacts.map(i => {
            return {
                name: i.username,
                id: i.username,
                online: true,
                action: () => {
                    contactState.sendTo(i);
                }
            };
        });

        cachedContacts.forEach(i => (itemsMap[i.name] = i));
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    contacts
                </Text>
            </View>
        );
    }
}

