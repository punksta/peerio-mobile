import React, { Component } from 'react';
import { View, LayoutAnimation, StatusBar } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import PopupLayout from '../layout/popup-layout';
import ChatList from '../messaging/chat-list';
import ChannelInviteList from '../messaging/channel-invite-list';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import mockChatStore from './mock-chat-store';
import { vars } from '../../styles/styles';
import HeaderMain from '../layout/header-main';

@observer
export default class MockChatList extends Component {

    componentDidMount() {
        User.current = {};
        chatState.store = mockChatStore;
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
