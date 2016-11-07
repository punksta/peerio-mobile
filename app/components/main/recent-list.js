import React, { Component } from 'react';
import {
    ScrollView
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import Avatar from '../shared/avatar';
import { chatStore } from '../../lib/icebear';

@observer
export default class RecentList extends Component {
    press(/* i, key */) {
        console.log('pressing');
        mainState.chat();
    }

    item(i, key) {
        const online = true;
        const lastMessage = 'n/a';
        const name = i.participants && i.participants.length ? i.participants[0].username : 'n/a';
        return (
            <Avatar
                icon="navigate-next"
                online={online}
                name={name}
                message={lastMessage}
                key={key}
                onPress={() => (mainState.chat())} />
        );
    }

    render() {
        // const items = [
        //     { name: 'Alice', lastMessage: 'will you go tomorrow to the office?', online: true },
        //     { name: 'Bob', lastMessage: 'drunken sailor wants me dead', online: true },
        //     { name: 'Kate', lastMessage: 'call me sometime', online: false },
        //     { name: 'Sam', lastMessage: 'will you be finishing the fries?', online: false },
        //     { name: 'Velma', lastMessage: 'where is scooby', online: false },
        //     { name: 'Vincent', lastMessage: 'are we going to play frisbee?', online: true },
        //     { name: 'Paul', lastMessage: 'eagle is the vehicle to freedom', online: true },
        //     { name: 'Anri', lastMessage: 'let them eat cake', online: false },
        //     { name: 'Flo', lastMessage: 'that is rather unfortunate', online: true },
        //     { name: 'Samuel', lastMessage: 'we are going to use ansible', online: false },
        //     { name: 'Eren', lastMessage: 'please specify the steps', online: true },
        //     { name: 'Skylar', lastMessage: 'i put my hands slowly on the front wheel', online: false },
        //     { name: 'Slava', lastMessage: 'let us leave it to the gods', online: false }
        // ];

        const items = chatStore.chats;

        return (
            <ScrollView>
                { items.map(this.item) }
            </ScrollView>
        );
    }
}
