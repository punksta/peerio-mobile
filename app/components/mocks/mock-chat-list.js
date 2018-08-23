import React, { Component } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import PopupLayout from '../layout/popup-layout';
import ChatList from '../messaging/chat-list';
import ContactList from '../contacts/contact-list';
import SettingsLevel1 from '../settings/settings-level-1';
import Files from '../files/files';
import ChannelInvite from '../messaging/channel-invite';
import icebear, { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import drawerState from '../shared/drawer-state';
import mockChatStore from './mock-chat-store';
import { vars } from '../../styles/styles';
import mockContactStore from './mock-contact-store';
import mockFileStore from './mock-file-store';
import TabContainer from '../layout/tab-container';
import { TopDrawerMaintenance, TopDrawerNewContact } from '../shared/top-drawer-components';

const button = {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1
};

const add1 = [
    button,
    {
        left: 50,
        backgroundColor: 'green'
    }
];

const add2 = [
    button,
    {
        right: 150,
        backgroundColor: 'blue'
    }
];

const remove = [
    button,
    {
        right: 50,
        backgroundColor: 'red'
    }
];

@observer
export default class MockChatList extends Component {
    componentWillMount() {
        User.current = mockContactStore.createMock();
        User.current.activePlans = [];
        mockFileStore.install();
        chatState.store = mockChatStore;
        chatState.init();
        icebear.chatStore = mockChatStore;
        icebear.contactStore = mockContactStore;
        icebear.fileStore = mockFileStore;
    }

    addGlobalDrawer = () => {
        drawerState.addDrawer(TopDrawerMaintenance);
    };

    addLocalDrawer = () => {
        drawerState.addDrawer(TopDrawerNewContact, drawerState.DRAWER_CONTEXT.CONTACTS, {
            contact: User.current
        });
    };

    removeDrawer = () => {
        drawerState.drawers.pop();
    };

    get list() {
        const { route } = chatState.routerMain;
        switch (route) {
            case 'channelInviteList':
                return <ChannelInvite />;
            case 'settings':
                return <SettingsLevel1 />;
            case 'chats':
                return <ChatList />;
            case 'contacts':
                return <ContactList />;
            case 'files':
                return <Files />;
            default:
                return <ContactList />;
        }
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                    flexGrow: 1,
                    paddingTop: vars.layoutPaddingTop
                }}
            >
                {this.list}
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
                <TabContainer />
                <TouchableOpacity
                    style={add1}
                    onPress={this.addGlobalDrawer}
                    pressRetentionOffset={vars.pressRetentionOffset}
                >
                    <Text semibold style={{ textAlign: 'center' }}>
                        Add Global
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={add2}
                    onPress={this.addLocalDrawer}
                    pressRetentionOffset={vars.pressRetentionOffset}
                >
                    <Text semibold style={{ textAlign: 'center' }}>
                        Add Local
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={remove}
                    onPress={this.removeDrawer}
                    pressRetentionOffset={vars.pressRetentionOffset}
                >
                    <Text semibold style={{ textAlign: 'center' }}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
