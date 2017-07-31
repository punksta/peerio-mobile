import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ContactSelector from '../contacts/contact-selector';
import buttons from '../helpers/buttons';
import { vars } from '../../styles/styles';
import chatState from './chat-state';

const fillView = { flex: 1, flexGrow: 1 };
const rowCenter = {
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
                <Text numberOfLines={2} style={bottomRowText}>Need to chat with more than 8 people?</Text>
                {buttons.uppercaseBlueButton('Create channel', () => this.props.createChannel())}
            </View>
        );
    }

    render() {
        return (
            <View style={fillView}>
                <ContactSelector
                    onExit={() => chatState.routerModal.discard()}
                    action={contacts => chatState.startChat(contacts)}
                    title="New direct message" limit={4} />
                {this.createChannelRow}
            </View>
        );
    }
}

ComposeMessage.propTypes = {
    createChannel: PropTypes.any
};
