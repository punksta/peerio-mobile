import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { observable, when } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ProgressOverlay from '../shared/progress-overlay';
import MessagingPlaceholder from '../messaging/messaging-placeholder';
import ChatItem from './chat-item';
import AvatarCircle from '../shared/avatar-circle';
import ChatActionSheet from './chat-action-sheet';
import contactState from '../contacts/contact-state';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import chatState from '../messaging/chat-state';
import ButtonText from '../controls/button-text';
// max new items which are scrolled animated
// const maxScrollableLength = 3;

const { width } = Dimensions.get('window');

@observer
export default class Chat extends SafeComponent {
    @observable contentHeight = 0;
    @observable scrollViewHeight = 0;
    @observable refreshing = false;
    // @observable maxSliceIndex = -1;
    enableNextScroll = false;
    lastLength = 0;
    topComponentRef = null;
    indicatorHeight = 16;

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
        return !!chatState.currentChat && !chatState.loading;
    }

    item = (item, index) => {
        const layout = e => {
            let { y } = e.nativeEvent.layout;
            const { height } = e.nativeEvent.layout;
            if (item.id === this.topChatID) {
                // console.log(`chat.js: scroll top ${y}, ${this.indicatorHeight}`);
                y -= this.indicatorHeight;
                if (y < 0) y = 0;
                this.topChatID = null;
                // y = Math.min(y, this.scrollViewHeight) / 2;
                this.scrollView.scrollTo({ y, animated: false });
            }
            if (item.id === this.bottomChatID) {
                console.log(`chat.js: scroll bottom`);
                this.bottomChatID = null;
                y = y + height - this.scrollViewHeight + this.indicatorHeight;
                this.scrollView.scrollTo({ y, animated: false });
            }
        };
        return (
            <ChatItem
                key={item.id || index}
                message={item}
                onRetryCancel={() => this._actionSheet.show(item, this.chat)}
                onLayout={layout} />
        );
    }

    layoutScrollView = (event) => {
        console.log('chat.js: layout scroll view');
        // this.scrollView.scrollToEnd();
        this.scrollViewHeight = event.nativeEvent.layout.height;
        this.contentSizeChanged();
    }

    contentSizeChanged = (contentWidth, contentHeight) => {
        console.log(`content size changed ${contentWidth}, ${contentHeight}`);
        if (!this.scrollView || !this.chat) return;

        if (contentHeight) {
            this.contentHeight = contentHeight;
        }

        if (this.refreshing || this.disableNextScroll) {
            return;
        }

        if (this._contentSizeChanged) clearTimeout(this._contentSizeChanged);
        this._contentSizeChanged = setTimeout(() => {
            if (this.scrollView && this.contentHeight && this.scrollViewHeight) {
                let indicatorSpacing = 0;
                if (this.chat.canGoUp) indicatorSpacing += this.indicatorHeight;
                if (this.chat.canGoDown) indicatorSpacing += this.indicatorHeight;
                const y = this.contentHeight - this.scrollViewHeight;
                if (y - indicatorSpacing < 0) {
                    // console.log('chat.js: less content than fit');
                    /* if (this.chat && (this.maxSliceIndex < this.chat.messages.length)) {
                        this.maxSliceIndex += 10;
                        this.disableAnimateNextScroll = true;
                    } */
                    // this.chat.messages.length && this.chat.loadPreviousPage();
                    // y = 0;
                }
                const animated = !this.disableAnimateNextScroll;
                // console.log('chat.js: auto scroll');
                if (!this.refreshing && !this.disableNextScroll) {
                    console.log('chat.js: auto scrolling');
                    this.scrollView.scrollTo({ y, animated });
                }
                this.animateNextScroll = false;
                this.disableNextScroll = false;
            } else {
                setTimeout(() => this.contentSizeChanged(), 1000);
            }
        }, 100);
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

    onScroll = (event) => {
        const { nativeEvent } = event;
        const updater = () => {
            const { contentHeight, scrollViewHeight, chat } = this;
            if (!contentHeight || !scrollViewHeight || !chat) return;
            const y = nativeEvent.contentOffset.y;
            const h = this.contentHeight - this.scrollViewHeight;
            // console.log(`chat.js: ${y}, ${h}`);
            if (y < this.indicatorHeight / 2) {
                this._onGoUp();
            }
            if (y >= h - this.indicatorHeight / 2) {
                this._onGoDown();
            }
            this.disableNextScroll = y < h - this.indicatorHeight;
        };
        if (this._updater) clearTimeout(this._updater);
        this._updater = setTimeout(updater, 500);
    }

    /* onViewableItemsChanged = ({ viewableItems, changed }) => {
        if (!viewableItems || !viewableItems.length) return;
        const updater = () => {
            this._onGoUp();
        };
        if (this._updater) clearTimeout(this._updater);
        if (viewableItems[0].index === 0) {
            this._updater = setTimeout(updater, 1000);
        }
        // console.log(viewableItems);
    } */

    listView() {
        if (chatState.loading) return null;
        const refreshControlTop = this.chat.canGoUp ? (
            <ActivityIndicator size="large" style={{ padding: 10 }} onLayout={e => (this.indicatorHeight = e.nativeEvent.layout.height)} />
        ) : null;
        const refreshControlBottom = this.chat.canGoDown ? (
            <ActivityIndicator size="large" style={{ padding: 10 }} />
        ) : null;
        /* return (
            <FlatList
                ListFooterComponent={this.chat.canGoDown ? ActivityIndicator : null}
                ListHeaderComponent={this.chat.canGoUp ? ActivityIndicator : null}
                onScroll={this.onScroll}
                onViewableItemsChanged={this.onViewableItemsChanged}
                onContentSizeChange={this.contentSizeChanged}
                onLayout={this.layoutScrollView}
                ref={sv => (this.scrollView = sv)}
                initialNumToRender={10}
                keyExtractor={item => item.id}
                data={this.data}
                renderItem={this.item} />
        ); */
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

    get archiveUpgrade() {
        const upgradeContainer = {
            backgroundColor: vars.lightGrayBg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 12
        };
        return this.props.archiveUpgrade ? (
            <View style={upgradeContainer}>
                <Text style={{ color: vars.txtDark }}>{tx('button_upgradeForArchive')}</Text>
                <ButtonText text={tx('upgrade')} />
            </View>
        ) : null;
    }

    get archiveNotice() {
        // TODO: archive notice
        /* eslint-disable */
        return true || this.props.archiveNotice ? (
            <Text style={{ textAlign: 'left', margin: 12, marginTop: 0, marginBottom: 16, color: vars.txtMedium }}>
                {tx('title_chatArchive')}
            </Text>
        ) : null;
    }

    zeroStateItem() {
        const zsContainer = {
            borderBottomWidth: 0,
            borderBottomColor: '#CFCFCF',
            marginBottom: 8
        };
        const { chat } = this;
        const participants = chat.participants || [];
        const w = 3 * 36;
        const shiftX = (width - w - w * participants.length) / participants.length;
        const shift = shiftX < 0 ? shiftX : 0;
        const marginLeft = shift < -w ? (-w + 1) : shift;
        const avatars = (participants || []).map(contact => (
            <View style={{ marginLeft, width: w }}>
                <TouchableOpacity
                    style={{ flex: 0 }}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    onPress={() => contactState.contactView(contact)} key={contact.username}>
                    <AvatarCircle
                        contact={contact}
                        medium />
                </TouchableOpacity>
            </View>
        ));
        return (
            <View style={zsContainer}>
                {this.archiveUpgrade}
                <View style={{ flexDirection: 'row', marginRight: 48, paddingLeft: -marginLeft }}>{avatars}</View>
                <Text style={{ textAlign: 'left', margin: 12, color: vars.txtDark }}>
                    {tx('title_chatBeginning')}
                    <Text>{' '}</Text>
                    <Text style={{ fontWeight: 'bold' }}>
                        {chat.name}
                    </Text>
                </Text>
                {this.archiveNotice}
            </View>
        );
    }

    renderThrow() {
        return (
            <View
                style={{ flexGrow: 1, paddingBottom: 4 }}>
                {this.data ? this.listView() : !chatState.loading && <MessagingPlaceholder />}
                <ProgressOverlay enabled={chatState.loading} />
                <ChatActionSheet ref={sheet => (this._actionSheet = sheet)} />
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: PropTypes.bool,
    archiveUpgrade: PropTypes.bool,
    archiveNotice: PropTypes.bool
};

