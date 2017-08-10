import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ContactSelector from '../contacts/contact-selector';
import buttons from '../helpers/buttons';
import { vars } from '../../styles/styles';
import chatState from './chat-state';

const LIMIT_PEOPLE = 8;
const fillView = { flex: 1, flexGrow: 1 };
const rowCenter = {
    backgroundColor: vars.white,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: vars.lightGrayBg
};
const bottomRowText = {
    flexShrink: 1,
    flex: 1,
    color: vars.txtDate,
    fontSize: 12,
    marginHorizontal: 16
};

export default class ComposeMessage extends Component {
    get createChannelRow() {
        return (
            <View style={rowCenter}>
                <Text numberOfLines={2} style={bottomRowText}>
                    {`Need to chat with more than ${LIMIT_PEOPLE} people?`}
                </Text>
                {buttons.uppercaseBlueButton('Create channel', () => chatState.routerModal.createChannel())}
            </View>
        );
    }

    render() {
        return (
            <View style={fillView}>
                <ContactSelector
                    onExit={() => chatState.routerModal.discard()}
                    action={contacts => chatState.startChat(contacts)}
                    title="New direct message" limit={LIMIT_PEOPLE} />
                {this.createChannelRow}
            </View>
        );
    }
}
