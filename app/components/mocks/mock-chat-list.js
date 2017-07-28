import React, { Component } from 'react';
import { View, LayoutAnimation, StatusBar } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import randomWords from 'random-words';
import ChatList from '../messaging/chat-list';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import mockContactStore from './mock-contact-store';
import { vars } from '../../styles/styles';

class MockChatStore {
    @observable chats = [];
    @observable loaded = true;

    constructor() {
        for (let i = 0; i < 15; ++i) {
            this.chats.push(this.createMock());
        }
        for (let i = 0; i < 2; ++i) {
            this.chats.push(this.createMockChannel());
        }
    }

    createMock() {
        return observable({
            title: randomWords({ min: 3, max: 5, join: ' ' }),
            participants: [mockContactStore.createMock()]
        });
    }

    createMockChannel() {
        return observable({
            isChannel: true,
            title: randomWords({ min: 1, max: 4, join: '-' }),
            participants: [mockContactStore.createMock()]
        });
    }
}

@observer
export default class MockChannelCreate extends Component {
    componentDidMount() {
        reaction(() => this.isChatMode, () => LayoutAnimation.easeInEaseOut());
        User.current = {};
        chatState.store = new MockChatStore();
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                <ChatList />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
