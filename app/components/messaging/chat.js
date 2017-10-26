import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { observable, when, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ProgressOverlay from '../shared/progress-overlay';
import MessagingPlaceholder from '../messaging/messaging-placeholder';
import ChatItem from './chat-item';
import AvatarCircle from '../shared/avatar-circle';
import ChatActionSheet from './chat-action-sheet';
import InlineImageActionSheet from '../files/inline-image-action-sheet';
import contactState from '../contacts/contact-state';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import chatState from '../messaging/chat-state';
import { popupSetupVideo } from '../shared/popups';
import VideoIcon from '../layout/video-icon';
import ChatVideo from '../messaging/chat-video';

const { width } = Dimensions.get('window');

@observer
export default class Chat extends SafeComponent {
    @observable contentHeight = 0;
    @observable scrollViewHeight = 0;
    @observable refreshing = false;
    @observable waitForScrollToEnd = true;
    @observable scrollEnabled = false;
    indicatorHeight = 16;

    componentDidMount() {
        this.selfMessageReaction = reaction(() => chatState.selfNewMessageCounter, () => {
            // scroll to end
            const y = this.contentHeight - this.scrollViewHeight;
            if (y) {
                this.scrollView.scrollTo({ y, animated: true });
            }
        });
    }

    componentWillUnmount() {
        this.selfMessageReaction();
    }

    get rightIcon() {
        const title = tx('Setup Jitsi Meet');
        const content = tx('Jitsi Meet is a web-based encrypted video chat and screen sharing service');
        const disc = tx('Jitsi app required on mobile devices.');
        // check whether PreferenceStore.hasSeenJitsiSuggestionPopup = true
        // should the popup be shown, or should a Jitsi link be provided?
        return <VideoIcon action={() => popupSetupVideo(title, content, disc, ChatVideo.storeLink)} />;
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

    _refs = { };

    item = (item, index) => {
        const key = item.id || index;
        return (
            <ChatItem
                key={key}
                ref={ref => { this._refs[key] = ref; }}
                message={item}
                onInlineImageAction={image => this._inlineImageActionSheet.show(image, item, this.chat)}
                onRetryCancel={() => this._actionSheet.show(item, this.chat)}
                />
        );
    }

    layoutScrollView = (event) => {
        this.scrollViewHeight = event.nativeEvent.layout.height;
        this.contentSizeChanged();
    }

    contentSizeChanged = async (contentWidth, contentHeight) => {
        console.log(`chat.js: content size changed ${contentWidth}, ${contentHeight}`);
        if (!this.scrollView || !this.chat) return;

        // set current content heigth
        if (contentHeight) this.contentHeight = contentHeight;

        // waiting for page loads or other updates
        if (this.refreshing || this.disableNextScroll) { return; }

        // throttle calls
        if (this._contentSizeChanged) clearTimeout(this._contentSizeChanged);
        this._contentSizeChanged = setTimeout(() => {
            if (this.scrollView && this.contentHeight && this.scrollViewHeight) {
                let indicatorSpacing = 0;
                if (this.chat.canGoUp) indicatorSpacing += this.indicatorHeight;
                if (this.chat.canGoDown) indicatorSpacing += this.indicatorHeight;
                const y = this.contentHeight - this.scrollViewHeight;
                this.scrollEnabled = y - indicatorSpacing > 0;
                // console.log('chat.js: auto scroll');
                if (!this.refreshing && !this.disableNextScroll) {
                    console.log('chat.js: auto scrolling');
                    this.scrollView.scrollTo({ y, animated: !this.waitForScrollToEnd });
                }

                if (this.waitForScrollToEnd) {
                    this.waitForScrollToEnd = false;
                }
                this.disableNextScroll = false;
            } else {
                setTimeout(() => this.contentSizeChanged(), 1000);
            }
        }, 100);
    }

    async measureItemById(id) {
        if (!id) return null;
        const ref = this._refs[id];
        if (!ref) { console.debug('chat.js: could not find ref'); return null; }
        const nativeViewRef = ref._ref._ref;
        if (!nativeViewRef) { console.debug('chat.js: could not resolve native view ref'); return null; }
        return new Promise(resolve =>
            nativeViewRef.measure((frameX, frameY, frameWidth, frameHeight, pageX, pageY) => resolve({ pageY, frameY }))
        );
    }

    oldMeasures = null;
    lastId = null;

    async saveItemPositionById(index) {
        if (!this.data[index]) return null;
        const { id } = this.data[index];
        this.lastId = id;
        this.oldMeasures = await this.measureItemById(id);
        return id;
    }

    async restoreScrollPositionById(id, bottom) {
        if (id !== this.lastId) {
            console.debug(`chat.js: wrong id to restore: ${id}, ${this.lastId}`);
            return;
        }
        const newMeasures = await this.measureItemById(id);
        const { oldMeasures } = this;
        let y = this.scrollViewHeight / 2;
        if (oldMeasures && newMeasures) {
            y = newMeasures.pageY - oldMeasures.pageY;
            if (bottom) {
                console.log(newMeasures);
                y = newMeasures.frameY - this.indicatorHeight; // + this.scrollViewHeight / 2;
                const maxScroll = this.contentHeight - this.scrollViewHeight;
                if (y > maxScroll || Platform.OS === 'android') {
                    y = maxScroll;
                }
            }
        }
        this.scrollView.scrollTo({ y, animated: false });
        this.oldMeasures = null;
    }

    async _onGoUp() {
        if (this.refreshing || this.chat.loadingTopPage || !this.chat.canGoUp) return;
        this.refreshing = true;
        const id = await this.saveItemPositionById(0);
        this.chat.loadPreviousPage();
        when(() => !this.chat.loadingTopPage, () => requestAnimationFrame(() => {
            this.restoreScrollPositionById(id);
            setTimeout(() => { this.refreshing = false; }, 1000);
        }));
    }

    async _onGoDown() {
        if (this.refreshing || this.chat.loadingBottomPage || !this.chat.canGoDown) return;
        this.refreshing = true;
        const id = await this.saveItemPositionById(this.data.length - 1);
        this.chat.loadNextPage();
        when(() => !this.chat.loadingBottomPage, () => requestAnimationFrame(() => {
            this.restoreScrollPositionById(id, true);
            setTimeout(() => { this.refreshing = false; }, 1000);
        }));
    }

    onScroll = (event) => {
        const { nativeEvent } = event;
        const updater = () => {
            const { contentHeight, scrollViewHeight, chat } = this;
            if (!contentHeight || !scrollViewHeight || !chat) return;
            const y = nativeEvent.contentOffset.y;
            const h = this.contentHeight - this.scrollViewHeight;
            // trigger previous page if we are at the top
            if (y < this.indicatorHeight / 2) this._onGoUp();
            // trigger next page if we are at the bottom
            if (y >= h - this.indicatorHeight / 2) this._onGoDown();
            this.disableNextScroll = y < h - this.indicatorHeight;
        };
        if (this._updater) clearTimeout(this._updater);
        this._updater = setTimeout(updater, 500);
    }

    listView() {
        if (chatState.loading) return null;
        const refreshControlTop = this.chat.canGoUp ? (
            <ActivityIndicator size="large" style={{ padding: 10 }}
                onLayout={e => { this.indicatorHeight = e.nativeEvent.layout.height; }} />
        ) : null;
        const refreshControlBottom = this.chat.canGoDown ? (
            <ActivityIndicator size="large" style={{ padding: 10 }} />
        ) : null;
        return (
            <ScrollView
                onLayout={this.layoutScrollView}
                style={{ flexGrow: 1, flex: 1, backgroundColor: vars.white }}
                initialListSize={1}
                onContentSizeChange={this.contentSizeChanged}
                scrollEnabled={this.scrollEnabled}
                scrollEventThrottle={0}
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="never"
                enableEmptySections
                ref={sv => { this.scrollView = sv; }}>
                {this.chat.canGoUp ? refreshControlTop : this.zeroStateItem()}
                {this.data.map(this.item)}
                {this.chat.limboMessages && this.chat.limboMessages.map(this.item)}
                {refreshControlBottom}
            </ScrollView>
        );
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
            <View key={contact.username} style={{ marginLeft, width: w }}>
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
                <View style={{ flexDirection: 'row', marginRight: 48, paddingLeft: -marginLeft }}>{avatars}</View>
                <Text style={{ textAlign: 'left', margin: 12, color: vars.txtDark }}>
                    {tx('title_chatBeginning', { chatName: chat.name })}
                </Text>
                {this.archiveNotice}
            </View>
        );
    }

    renderThrow() {
        return (
            <View
                style={{ flexGrow: 1, paddingBottom: 4 }}>
                {/* this.chat && !this.chat.canGoUp && upgradeForArchive() */}
                <View style={{ flex: 1, flexGrow: 1 }}>
                    {this.data ? this.listView() : !chatState.loading && <MessagingPlaceholder />}
                </View>
                <ProgressOverlay enabled={chatState.loading} />
                <ChatActionSheet ref={sheet => (this._actionSheet = sheet)} />
                <InlineImageActionSheet ref={sheet => (this._inlineImageActionSheet = sheet)} />
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: PropTypes.bool,
    archiveNotice: PropTypes.bool
};
