import React, { Component } from 'react';
import { View, LayoutAnimation, StatusBar } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import ChatList from '../messaging/chat-list';
import ChannelInviteList from '../messaging/channel-invite-list';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import mockChatStore from './mock-chat-store';
import { vars } from '../../styles/styles';

@observer
export default class MockChannelCreate extends Component {
    componentDidMount() {
        User.current = {};
        chatState.store = mockChatStore;
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                <ChannelInviteList />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
