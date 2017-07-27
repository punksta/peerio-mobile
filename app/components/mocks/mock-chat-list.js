import React, { Component } from 'react';
import { View, LayoutAnimation } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import ChatList from '../messaging/chat-list';
import { User } from '../../lib/icebear';

class MockChatStore {
}

@observer
export default class MockChannelCreate extends Component {
    @observable isChatMode = true;

    componentDidMount() {
        reaction(() => this.isChatMode, () => LayoutAnimation.easeInEaseOut());
        User.current = {};
    }

    createChannel = () => { this.isChatMode = false; }

    createChat = () => { this.isChatMode = true; }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <ChatList />
            </View>
        );
    }
}
