import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import ContactSelectorUserBox from './contact-selector-userbox';

const container = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vars.spacing.small.midi2x,
    paddingLeft: vars.spacing.small.midi2x,
    flexWrap: 'wrap'
};

@observer
export default class ContactSelectorUserBoxLine extends Component {
    render() {
        const boxes = this.props.contacts.map((contact, i) => (
            <ContactSelectorUserBox
                contact={contact}
                key={i}
                onPress={() => this.props.onPress(contact)} />
        ));
        return (
            <View style={container}>
                {boxes}
            </View>
        );
    }
}

