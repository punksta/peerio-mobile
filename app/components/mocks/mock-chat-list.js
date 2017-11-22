import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from '../layout/popup-layout';
import ChatList from '../messaging/chat-list';
import ChannelInviteList from '../messaging/channel-invite-list';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import mockChatStore from './mock-chat-store';
import { vars } from '../../styles/styles';

@observer
export default class MockChatList extends Component {
    componentDidMount() {
        User.current = {};
        chatState.store = mockChatStore;
        chatState.init();
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                {chatState.routerMain.route === 'channelInviteList' ? <ChannelInviteList /> : <ChatList />}
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
