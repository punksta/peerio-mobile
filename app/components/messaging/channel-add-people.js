import React, { Component } from 'react';
import { View } from 'react-native';
import ContactSelector from '../contacts/contact-selector';
import chatState from '../messaging/chat-state';

const fillView = { flex: 1, flexGrow: 1 };

export default class ChannelAddPeople extends Component {

    addPeople = (contacts) => {
        chatState.currentChat.sendInvites(contacts);
    }

    render() {
        return (
            <View style={fillView}>
                <ContactSelector
                    onExit={() => chatState.routerModal.discard()}
                    action={this.addPeople} title="Add people to channel" />
            </View>
        );
    }
}
