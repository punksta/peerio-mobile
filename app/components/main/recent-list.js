import React, { Component } from 'react';
import {
    ScrollView, RefreshControl
} from 'react-native';
import { observable, when } from 'mobx';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import Avatar from '../shared/avatar';
import { chatStore } from '../../lib/icebear';

@observer
export default class RecentList extends Component {
    constructor(props) {
        super(props);
        this._onRefresh = this._onRefresh.bind(this);
    }

    @observable refreshing = false;

    _onRefresh() {
        this.refreshing = true;
        chatStore.loadAllChats();
        when(() => !chatStore.loading, () => (this.refreshing = false));
    }

    item(i, key) {
        const online = true;
        const lastMessage = '';
        const name = i.participants && i.participants.length ? i.participants.map(p => p.username).join(', ') : '';
        return (
            <Avatar
                loading={i.loadingMeta}
                icon="navigate-next"
                online={online}
                name={name}
                message={lastMessage}
                key={key}
                onPress={() => (mainState.chat(i))} />
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
        const refreshControl = (
            <RefreshControl
                refreshing={this.refreshing}
                onRefresh={this._onRefresh}
            />
        );

        return (
            <ScrollView refreshControl={refreshControl}>
                { items.map(this.item) }
            </ScrollView>
        );
    }
}
