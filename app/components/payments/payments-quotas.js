import React, { Component } from 'react';
import {
    ScrollView, View, Text
} from 'react-native';
import SafeComponent from '../shared/safe-component';
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

export default class PaymentsQuotas extends SafeComponent {
    renderThrow() {
        const q = User.current.quota;
        return (
            <ScrollView style={bgStyle}>
                <Text style={header}>Current quota</Text>
                <Text>{JSON.stringify(q, null, ' ')}</Text>
            </ScrollView>
        );
    }
}
