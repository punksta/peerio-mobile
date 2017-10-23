import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import ContactSelector from '../contacts/contact-selector';
import chatState from '../messaging/chat-state';
import SafeComponent from '../shared/safe-component';

const fillView = { flex: 1, flexGrow: 1 };

@observer
export default class ChannelAddPeople extends SafeComponent {

    addPeople = (contacts) => {
        console.log(JSON.stringify(contacts));
        chatState.currentChat.addParticipants(contacts);
    }

    render() {
        const excluded = {};
        chatState.currentChat.joinedParticipants.forEach(
            i => { excluded[i.username] = i; console.log(`excluded: ${i.username}`); }
        );
        return (
            <View style={fillView}>
                <ContactSelector
                    exclude={excluded}
                    onExit={() => chatState.routerModal.discard()}
                    action={this.addPeople} title="Add people to channel" />
            </View>
        );
    }
}
