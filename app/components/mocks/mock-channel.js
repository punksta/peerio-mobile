import React, { Component } from 'react';
import { View, LayoutAnimation, StatusBar } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import HeaderMain from '../layout/header-main';
import Chat from '../messaging/chat';
import ChannelInfo from '../messaging/channel-info';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import mockChatStore from './mock-chat-store';
import routerMain from '../routes/router-main';
import { vars } from '../../styles/styles';

@observer
export default class MockChannelCreate extends Component {
    @observable showChannelInfo = true;
    componentWillMount() {
        User.current = {};
        chatState.store = mockChatStore;
        routerMain.current = observable({
            routeState: observable({
                title: '# channel-mock',
                titleAction: () => { this.showChannelInfo = true; }
            })
        });
    }

    get channelList() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <HeaderMain />
                <Chat archiveNotice />
                <StatusBar barStyle="light-content" />
            </View>
        );
    }

    get channelInfo() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <ChannelInfo />
                <StatusBar barStyle="default" />
            </View>
        );
    }

    render() {
        return this.showChannelInfo ? this.channelInfo : this.channelList;
    }
}
