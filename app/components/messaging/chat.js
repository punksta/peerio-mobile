import React, { Component } from 'react';
import {
    ScrollView, View, Text, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import ProgressOverlay from '../shared/progress-overlay';
import MessagingPlaceholder from '../messaging/messaging-placeholder';
import ChatItem from './chat-item';
import AvatarCircle from '../shared/avatar-circle';
import contactState from '../contacts/contact-state';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import chatState from '../messaging/chat-state';
// max new items which are scrolled animated
const maxScrollableLength = 3;

@observer
export default class Chat extends Component {
    @observable contentHeight = 0;
    @observable scrollViewHeight = 0;
    @observable refreshing = false;
    enableNextScroll = false;
    lastLength = 0;
    topComponentRef = null;
    indicatorHeight = 40;

    constructor(props) {
        super(props);
        this.layoutScrollView = this.layoutScrollView.bind(this);
        this.contentSizeChanged = this.contentSizeChanged.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.item = this.item.bind(this);
    }

    get data() {
        return this.chat ? this.chat.messages : null;
    }

    get chat() {
        return chatState.currentChat;
    }

    get showInput() {
        return !!chatState.currentChat;
    }

    componentWillMount() {
        /* reaction(() => (this.chat ? this.chat.limboMessages.length : 0), l => {
            this.disableNextScroll = l < this.lastLength;
            this.animateNextScroll = l > this.lastLength;
            this.lastLength = l;
        });
        this.animateNextScroll = false; */
    }

    item(message, i) {
        const layout = e => {
            let { y } = e.nativeEvent.layout;
            const { height } = e.nativeEvent.layout;
            if (message.id === this.topChatID) {
                console.log(`chat.js: scroll top ${y}, ${this.indicatorHeight}`);
                y -= this.indicatorHeight;
                if (y < 0) y = 0;
                this.topChatID = null;
                // y = Math.min(y, this.scrollViewHeight) / 2;
                this.scrollView.scrollTo({ y, animated: false });
                console.log(`chat.js: scroll top`);
            }
            if (message.id === this.bottomChatID) {
                console.log(`chat.js: scroll bottom`);
                this.bottomChatID = null;
                y = y + height - this.scrollViewHeight + this.indicatorHeight;
                setTimeout(() => this.scrollView.scrollTo({ y, animated: false }), 0);
            }
        };
        return <ChatItem key={message.id || i} chat={this.chat} message={message} onLayout={layout} />;
    }

    layoutScrollView(event) {
        console.log('chat.js: layout scroll view');
        this.scrollViewHeight = event.nativeEvent.layout.height;
        this.contentSizeChanged();
    }

    contentSizeChanged(contentWidth, contentHeight) {
        if (!this.scrollView || !this.chat) return;

        if (contentHeight) {
            this.contentHeight = contentHeight;
        }

        if (this.refreshing) {
            return;
        }

        //     let y = (contentHeight - this.contentHeight) / 2;
        //     if (y < 0) y = 0;
        //     // this.scrollView.scrollTo({ y, animated: true });
        //     this.refreshing = false;
        //     return;
        // }

        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

        this.scrollTimeout = setTimeout(() => {
            if (this.scrollView && this.contentHeight && this.scrollViewHeight) {
                let indicatorSpacing = 0;
                if (this.chat.canGoUp) indicatorSpacing += this.indicatorHeight;
                if (this.chat.canGoDown) indicatorSpacing += this.indicatorHeight;
                let y = this.contentHeight - this.scrollViewHeight;
                if (y - indicatorSpacing < 0) {
                    console.log('chat.js: less content than fit');
                    this.chat.messages.length && this.chat.loadPreviousPage();
                    y = 0;
                }
                const animated = this.animateNextScroll;
                console.log('chat.js: auto scroll');
                !this.disableNextScroll && this.scrollView.scrollTo({ y, animated });
                this.animateNextScroll = false;
                this.disableNextScroll = false;
            } else {
                setTimeout(() => this.contentSizeChanged(), 1000);
            }
        }, 0);
    }

    _onGoUp() {
        if (this.refreshing || this.chat.loadingTopPage || !this.chat.canGoUp) return;
        this.refreshing = true;
        this.topChatID = this.data[0].id;
        this.chat.loadPreviousPage();
        when(() => !this.chat.loadingTopPage, () => setTimeout(() => (this.refreshing = false), 1000));
    }

    _onGoDown() {
        if (this.refreshing || this.chat.loadingBottomPage || !this.chat.canGoDown) return;
        this.refreshing = true;
        this.bottomChatID = this.data[this.data.length - 1].id;
        this.chat.loadNextPage();
        when(() => !this.chat.loadingBottomPage, () => setTimeout(() => (this.refreshing = false), 1000));
    }

    onScroll(event) {
        if (!this.contentHeight || !this.scrollViewHeight || !this.chat) return;
        const y = event.nativeEvent.contentOffset.y;
        const h = this.contentHeight - this.scrollViewHeight;
        // console.log(`chat.js: ${y}, ${h}`);
        if (y < this.indicatorHeight / 2) {
            this._onGoUp();
        }
        if (y >= h - this.indicatorHeight / 2) {
            this._onGoDown();
        }
    }

    listView() {
        const refreshControlTop = this.chat.canGoUp ? (
            <ActivityIndicator size="large" style={{ padding: 10 }} onLayout={e => (this.indicatorHeight = e.nativeEvent.layout.height)} />
        ) : null;
        const refreshControlBottom = this.chat.canGoDown ? (
            <ActivityIndicator size="large" style={{ padding: 10 }} />
        ) : null;
        return (
            <ScrollView
                onLayout={this.layoutScrollView}
                style={{ flexGrow: 1 }}
                initialListSize={1}
                onContentSizeChange={this.contentSizeChanged}
                scrollEventThrottle={0}
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="never"
                enableEmptySections
                ref={sv => (this.scrollView = sv)}>
                {this.chat.canGoUp ? refreshControlTop : this.zeroStateItem()}
                {this.data.map(this.item)}
                {this.chat.limboMessages && this.chat.limboMessages.map(this.item)}
                {refreshControlBottom}
            </ScrollView>
        );
    }

    zeroStateItem() {
        const zsContainer = {
            borderBottomWidth: 1,
            borderBottomColor: '#CFCFCF'
        };
        const chat = this.chat;
        const avatars = (chat.participants || []).map(contact => (
            <TouchableOpacity
                onPress={() => contactState.contactView(contact)} key={contact.username}>
                <AvatarCircle
                    contact={contact}
                    medium />
            </TouchableOpacity>
        ));
        return (
            <View style={zsContainer}>
                <View style={{ flexDirection: 'row' }}>{avatars}</View>
                <Text style={{ textAlign: 'center', margin: 12, color: vars.txtMedium }}>
                    {tx('title_chatBeginning')}
                    <Text>{' '}</Text>
                    <Text style={{ fontWeight: 'bold' }}>
                        {chat.chatName}
                    </Text>
                </Text>
            </View>
        );
    }

    render() {
        return (
            <View
                style={{ flexGrow: 1, paddingBottom: 4 }}>
                {this.data ? this.listView() : !chatState.loading && <MessagingPlaceholder />}
                <ProgressOverlay enabled={chatState.loading} />
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: React.PropTypes.bool
};

