import React from 'react';
import { View, Text, SectionList } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import { chatInviteStore } from '../../lib/icebear';
import ChannelUpgradeOffer from '../channels/channel-upgrade-offer';
import ChannelInviteListItem from './channel-invite-list-item';
import SafeComponent from '../shared/safe-component';
import chatState from './chat-state';
import { tx } from '../utils/translator';
import Layout1 from '../layout/layout1';
import Bottom from '../controls/bottom';
import SnackBar from '../snackbars/snackbar';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import routes from '../routes/routes';

const INITIAL_LIST_SIZE = 20;

const caughtUpContainerStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
    marginBottom: 100
};

const allCaughtUpTextStyle = {
    fontSize: vars.font.size.huge,
    color: 'black',
    marginBottom: 3
};

const thumbsUpTextStyle = {
    fontSize: 48,
    marginBottom: 15
};

@observer
export default class ChannelInviteList extends SafeComponent {
    header() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            padding: vars.spacing.small.midi2x,
            alignItems: 'center'
        };
        const textStyle = {
            marginLeft: vars.iconSize * 2,
            textAlign: 'center',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: vars.font.size.big,
            fontWeight: vars.font.weight.semiBold,
            color: vars.txtDark
        };
        return (
            <View style={{ paddingTop: vars.statusBarHeight * 2 }}>
                <View style={container}>
                    <Text style={textStyle}>{tx('title_channelInvites')}</Text>
                    {icons.dark('close', () => routes.modal.discard(this))}
                </View>
            </View>
        );
    }

    dataSource = [];
    @observable refreshing = false

    constructor(props) {
        super(props);
        this.header = this.header.bind(this);
    }

    get data() { return chatInviteStore.received || []; }

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
            this.dataSource = [{ data: this.data.slice(), key: tx('title_channelRecentInvitations') }];
            this.forceUpdate();
        }, true);
    }

    item({ item }) {
        return (
            <ChannelInviteListItem invitation={item} />
        );
    }

    listView() {
        return (
            <SectionList
                style={{ flex: 1, flexGrow: 1 }}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.id || item.kegDbId}
                renderItem={this.item}
                ref={sv => { this.scrollView = sv; }}
            />
        );
    }

    allCaughtUp() {
        return (
            <View style={caughtUpContainerStyle}>
                <Text style={thumbsUpTextStyle}>
                    {'👍'}
                </Text>
                <Text style={allCaughtUpTextStyle}>
                    {tx('title_allCaughtUp')}
                </Text>
                <Text>
                    {tx('title_noMoreInvites')}
                </Text>
            </View>
        );
    }

    body() {
        return (
            <View style={{ flexGrow: 1, flex: 1, backgroundColor: vars.white }}>
                <ChannelUpgradeOffer />
                {this.data.length > 0
                    ?
                    this.listView()
                    :
                    this.allCaughtUp()
                }
            </View>
        );
    }

    renderThrow() {
        const header = this.header();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        const snackbar = (
            <Bottom>
                <SnackBar />
            </Bottom>
        );
        return (
            <Layout1
                defaultBar
                body={body}
                header={header}
                noFitHeight
                footerAbsolute={snackbar}
                style={layoutStyle} />
        );
    }
}
