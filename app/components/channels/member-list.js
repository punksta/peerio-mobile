import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity, ListView } from 'react-native';
import { reaction } from 'mobx';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import SafeComponent from '../shared/safe-component';
import chatState from '../messaging/chat-state';
import ChatInfoSectionHeader from '../messaging/chat-info-section-header';
import Avatar from '../shared/avatar';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';

@observer
export default class MemberList extends SafeComponent {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2
        });
    }

    dataSource = null;
    channelMembers = null;
    channelInvites = null;

    get data() { return chatState.currentChat; }

    get hasData() {
        return !!this.channelMembers || !!this.channelInvites;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.data.length
        ], () => {
            const channel = this.data;
            this.channelMembers = channel.allJoinedParticipants;
            this.channelInvites = chatState.chatInviteStore.sent.get(channel.id);
            this.dataSource = this.dataSource.cloneWithRowsAndSections({
                title_Members: this.channelMembers,
                title_invited: this.channelInvites,
                dummy: []
            });
            this.forceUpdate();
        }, true);
    }

    headers = (data, key) => {
        const i = (title, component) => {
            const r = {};
            r[title] = component;
            return r;
        };
        const titles = {
            ...i('title_Members',
                <ChatInfoSectionHeader title={tx('title_Members')} collapsible />),
            ...i('title_invited',
                <ChatInfoSectionHeader title={tx('title_invited')} />),
            ...i('dummy', <View />)
        };
        return data && data.length ? titles[key] : null;
    };

    participant = (contact, i) => {
        const channel = this.data;
        const { username } = contact;
        const row = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1
        };
        const isAdmin = channel.isAdmin(contact);
        return (
            <View key={contact.username} style={row}>
                <View style={{ flex: 1, flexGrow: 1 }}>
                    <Avatar
                        noBorderBottom
                        contact={contact}
                        key={username || i}
                        message=""
                        hideOnline />
                </View>
                <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                    {isAdmin && <View style={{ backgroundColor: vars.tabsFg, borderRadius: 4, padding: vars.spacing.small.mini2x, overflow: 'hidden', marginRight: vars.spacing.small.maxi2x }}>
                        <Text style={{ color: vars.white, fontSize: vars.font.size.small }}>
                            {tx('title_admin')}
                        </Text>
                    </View>}
                    {channel.canIAdmin && <Menu>
                        <MenuTrigger
                            renderTouchable={() => <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} />}
                            style={{ padding: vars.iconPadding }}>
                            {icons.plaindark('more-vert')}
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption
                                onSelect={() => (isAdmin ?
                                    channel.demoteAdmin(contact) :
                                    channel.promoteToAdmin(contact))}>
                                <Text>{isAdmin ?
                                    tx('button_demoteAdmin') : tx('button_makeAdmin')}
                                </Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => channel.removeParticipant(contact)}>
                                <Text>{tx('button_remove')}</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>}
                </View>
            </View>
        );
    };


    renderThrow() {
        if (!this.hasData) return null;
        return (
            <ListView
                style={{ flexGrow: 1 }}
                dataSource={this.dataSource}
                renderRow={this.participant}
                renderSectionHeader={this.headers}
            />
        );
    }
}

