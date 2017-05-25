import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { contactStore } from '../../lib/icebear';

const circleDiameter = 18;

const circleStyle = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    margin: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
};

export default class ReadReceipt extends SafeComponent {
    constructor(props) {
        super(props);
        this.contact = contactStore.getContact(props.username);
    }

    renderThrow() {
        const { color, letter } = this.contact;
        const circleOnline = {
            backgroundColor: color || '#ccc'
        };
        return (
            <View style={[circleStyle, circleOnline]}>
                <Text style={{ fontSize: 9, color: 'white' }}>{letter}</Text>
            </View>
        );
    }
}

ReadReceipt.propTypes = {
    username: React.PropTypes.string
};
