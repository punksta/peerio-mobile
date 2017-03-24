import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import { t, tx } from '../utils/translator';
import { User } from '../../lib/icebear';

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
export default class PaymentsQuotas extends Component {
    render() {
        const q = User.current.quota;
        return (
            <View style={bgStyle}>
                <Text style={header}>Current quota</Text>
                <Text>{JSON.stringify(q)}</Text>
            </View>
        );
    }
}
