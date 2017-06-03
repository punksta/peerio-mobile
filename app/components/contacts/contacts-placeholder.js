import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';

@observer
export default class ContactsPlaceholder extends SafeComponent {
    renderThrow() {
        const s = {
            flex: 1,
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <View style={s}>
                <Text>Peerio Messenger is more fun with friends</Text>
                <Text>IMPORT CONTACTS</Text>
            </View>
        );
    }
}
