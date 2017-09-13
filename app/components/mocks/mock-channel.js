import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import HeaderMain from '../layout/header-main';
import Chat from '../messaging/chat';
import ChannelInfo from '../messaging/channel-info';
import PopupLayout from '../layout/popup-layout';
import ChannelAddPeople from '../messaging/channel-add-people';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import contactState from '../contacts/contact-state';
import mockContactStore from './mock-contact-store';
import mockChatStore from './mock-chat-store';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';

@observer
export default class MockChannelCreate extends Component {
    @observable showChannelInfo = false;
    @observable showAddPeople = false;
    componentWillMount() {
        User.current = { activePlans: [] };
        contactState.store = mockContactStore;
        chatState.store = mockChatStore;
        routerMain.current = observable({
            routeState: observable({
                title: '# channel-mock',
                titleAction: () => { this.showChannelInfo = true; }
            })
        });
        const discard = routerModal.discard.bind(routerModal);
        routerModal.discard = () => {
            this.showChannelInfo = false;
            this.showAddPeople = false;
            if (routerModal.route === 'channelAddPeople') {
                this.showChannelInfo = true;
            }
            discard();
        };

        reaction(() => routerModal.route, route => {
            if (route === 'channelAddPeople') {
                this.showChannelInfo = false;
                this.showAddPeople = true;
            }
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

    get addPeople() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <ChannelAddPeople />
                <StatusBar barStyle="default" />
            </View>
        );
    }

    get body() {
        if (this.showChannelInfo) return this.channelInfo;
        if (this.showAddPeople) return this.addPeople;
        return this.channelList;
    }

    render() {
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                {this.body}
                <PopupLayout key="popups" />
            </View>
        );
    }
}
