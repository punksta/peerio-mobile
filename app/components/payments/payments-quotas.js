import React from 'react';
import { observer } from 'mobx-react/native';
import { ScrollView, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import { tx } from '../utils/translator';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: 'white'
};

const header = {
    fontWeight: 'bold'
};

@observer
export default class PaymentsQuotas extends SafeComponent {
    renderThrow() {
        const q = User.current.quota;
        return (
            <ScrollView style={bgStyle}>
                <Text style={header}>{tx('title_currentQuota')}</Text>
                <Text>{JSON.stringify(q, null, ' ')}</Text>
            </ScrollView>
        );
    }
}
