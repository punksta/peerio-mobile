import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, SectionList, Text } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import chatState from './chat-state';
import { vars } from '../../styles/styles';
import ChannelInviteListItem from './channel-invite-list-item';
import ChatChannelInvitesSection from './chat-channel-invites-section';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ChannelInviteList extends SafeComponent {
    dataSource = [];
    @observable refreshing = false

    constructor(props) {
        super(props);
        this.header = this.header.bind(this);
    }

    get data() { return chatState.store.invites; }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            chatState.routerMain.route === 'chats',
            chatState.routerMain.currentIndex === 0,
            this.data,
            this.data.length,
            this.maxLoadedIndex
        ], () => {
            this.dataSource = [{ data: this.data.slice(), key: 'Recent Invitations' }];
            this.forceUpdate();
        }, true);
    }

    item({ item }) {
        return (
            <ChannelInviteListItem chat={item} />
        );
    }

    header({ section: /* data, */ { key } }) {
        return <ChatChannelInvitesSection key={key} data={this.data && this.data.length} title={key} />;
    }

    listView() {
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.id}
                renderItem={this.item}
                renderSectionHeader={this.header}
                ref={sv => (this.scrollView = sv)}
            />
        );
    }

    renderThrow() {
        return (
            <View
                style={{ flexGrow: 1, flex: 1, backgroundColor: vars.white }}>
                {this.listView()}
            </View>
        );
    }
}

ChannelInviteList.propTypes = {
    store: PropTypes.any
};
