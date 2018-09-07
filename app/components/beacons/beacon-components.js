import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Beacon from './beacon';

@observer
export class ChatIconBeacon extends SafeComponent {
    renderThrow() {
        return (
            <Beacon
                {...this.props}
                key="mobile-chat-icon"
                id="mobile-chat-icon"
                textHeader="See all your conversations here."
                textLine1="Start a new conversation or check-in on your direct messages and rooms."
            />
        );
    }
}

@observer
export class ContactIconBeacon extends SafeComponent {
    renderThrow() {
        return (
            <Beacon
                {...this.props}
                key="mobile-contact-icon"
                id="mobile-contact-icon"
                textHeader="See all your contacts here."
                textLine1="Invite people or see who already uses peerio in your contacts."
            />
        );
    }
}

module.exports = {
    ChatIconBeacon,
    ContactIconBeacon
};
