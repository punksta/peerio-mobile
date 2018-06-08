import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { ScrollView, Image, View, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { observable, action, when, reaction, computed } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import ProgressOverlay from '../shared/progress-overlay';
import ChatZeroStatePlaceholder from './chat-zero-state-placeholder';
import ChatItem from './chat-item';
import AvatarCircle from '../shared/avatar-circle';
import ChatUnreadMessageIndicator from './chat-unread-message-indicator';
import FileActionSheet from '../files/file-action-sheet';
import contactState from '../contacts/contact-state';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import chatState from '../messaging/chat-state';
import uiState from '../layout/ui-state';
import VideoIcon from '../layout/video-icon';
import IdentityVerificationNotice from './identity-verification-notice';
import DmContactInvite from './dm-contact-invite';
import { clientApp } from '../../lib/icebear';

const { width } = Dimensions.get('window');

function getOrMake(id, map, make) {
    if (!map[id]) {
        map[id] = make();
    }
    return map[id];
}

@observer
export default class Chat extends SafeComponent {
    @observable contentHeight = 0;
    @observable scrollViewHeight = 0;
    @observable refreshing = false;
    @observable waitForScrollToEnd = true;
    @observable scrollEnabled = false;
    @observable limboMessages = null;
    @observable initialScrollDone = false;
    indicatorHeight = 16;

    componentDidMount() {
        this.selfMessageReaction = reaction(() => chatState.selfNewMessageCounter,
            () => {
                this.isAtBottom = true;
            }
        );
        this.chatReaction = reaction(() => chatState.store.activeChat, this.resetScrolling);
    }

    resetScrolling = () => {
        this.initialScrollDone = false;
        this.waitForScrollToEnd = true;
        this.contentHeight = 0;
    };

    componentWillUnmount() {
        if (this.unreadMessageIndicatorTimeout) {
            clearTimeout(this.unreadMessageIndicatorTimeout);
            this.unreadMessageIndicatorTimeout = null;
        }
        uiState.customOverlayComponent = null;
        this.selfMessageReaction();
        this.chatReaction();
    }

    get rightIcon() {
        // show video icon then call function: returned link is then passed on to the message-printing function
        return <VideoIcon onAddVideoLink={link => chatState.addVideoMessage(link)} />;
    }

    get data() {
        return this.chat ? this.chat.messages : null;
    }

    get chat() {
        return chatState.currentChat;
    }

    get showInput() {
        return !!chatState.currentChat && !chatState.loading && !this.chat.isInvite;
    }

    _refs = {};
    _itemActionMap = {};

    // TODO add folder action sheet
    item = (item, index) => {
        const key = item.id || index;
        const actions = getOrMake(
            key, this._itemActionMap, () => ({
                ref: ref => { this._refs[key] = ref; },
                onInlineImageAction: image => FileActionSheet.show(image),
                onLegacyFileAction: file => FileActionSheet.show(file),
                onFileAction: file => FileActionSheet.show(file, true)
            }));
        return (
            <ChatItem
                key={key}
                message={item}
                chat={this.chat}
                {...actions}
            />
        );
    };

    layoutScrollView = (event) => {
        this.scrollViewHeight = event.nativeEvent.layout.height;
        this.contentSizeChanged();
    };

    contentSizeChanged = async (contentWidth, contentHeight) => {
        // console.log(`chat.js: content size changed ${contentWidth}, ${contentHeight}`);
        if (!this.scrollView || !this.chat) return;

        const wasAtBottom = this.isAtBottom;

        // set current content heigth
        if (contentHeight) this.contentHeight = contentHeight;

        // waiting for page loads or other updates
        if (this.refreshing || this.disableNextScroll) {
            console.debug(`refreshing: ${this.refreshing}, disableNextScroll: ${this.disableNextScroll}`);
            return;
        }

        // throttle calls
        if (this._contentSizeChanged) clearTimeout(this._contentSizeChanged);
        this._contentSizeChanged = setTimeout(() => {
            if (this.scrollView && this.contentHeight && this.scrollViewHeight) {
                let indicatorSpacing = 0;
                if (this.chat.canGoUp) indicatorSpacing += this.indicatorHeight;
                if (this.chat.canGoDown) indicatorSpacing += this.indicatorHeight;
                const y = this.contentHeight - this.scrollViewHeight;
                this.scrollEnabled = y - indicatorSpacing > 0;
                console.debug(`in timeout refreshing: ${this.refreshing}, disableNextScroll: ${this.disableNextScroll}`);
                if (!this.refreshing) {
                    if (!this.initialScrollDone ||
                        wasAtBottom) {
                        console.log('chat.js: auto scrolling');
                        this.isAtBottom = wasAtBottom;
                        this.scrollView.scrollTo({ y, animated: false });
                        requestAnimationFrame(() => { this.initialScrollDone = true; });
                    }
                }

                if (this.waitForScrollToEnd) {
                    this.waitForScrollToEnd = false;
                }
            } else {
                this._contentSizeChanged = setTimeout(() => this.contentSizeChanged(), 1000);
            }
        }, 300);
    };

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
                y = this.contentHeight - this.scrollViewHeight * 1.5;
                // y = newMeasures.frameY - this.indicatorHeight; // + this.scrollViewHeight / 2;
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
        when(() => !this.chat.loadingBottomPage, () => setTimeout(() => {
            this.restoreScrollPositionById(id, true);
            setTimeout(() => { this.refreshing = false; }, 1000);
        }), 100);
    }

    isAtBottom = true;

    unreadMessageIndicatorTimeout = null;

    onScroll = (event) => {
        const { nativeEvent } = event;
        const { y } = nativeEvent.contentOffset;
        const maxY = this.contentHeight - this.scrollViewHeight;
        // values here may be float therefore the magic "2" number
        this.isAtBottom = (maxY - y) < 2;
        console.log(`onscroll: ${y} - ${this.contentHeight} - ${this.scrollViewHeight}, ${y - maxY}`);
        clientApp.isReadingNewestMessages = this.isAtBottom;

        if (this.unreadMessageIndicatorTimeout) {
            clearTimeout(this.unreadMessageIndicatorTimeout);
            this.unreadMessageIndicatorTimeout = null;
        }

        if (!this.isAtBottom && !chatState.loading) {
            this.unreadMessageIndicatorTimeout = setTimeout(() => {
                if (this.isAtBottom || chatState.loading) return;
                uiState.customOverlayComponent =
                    <ChatUnreadMessageIndicator onPress={this.scrollToBottom} />;
            }, 1000);
        } else {
            uiState.customOverlayComponent = null;
        }
        const updater = () => {
            const { contentHeight, scrollViewHeight, chat } = this;
            if (!contentHeight || !scrollViewHeight || !chat) return;

            const h = this.contentHeight - this.scrollViewHeight;
            // trigger previous page if we are at the top
            if (y < this.indicatorHeight / 2) this._onGoUp();
            // trigger next page if we are at the bottom
            if (y >= h - this.indicatorHeight / 2) this._onGoDown();
            // this.disableNextScroll = y < h - this.indicatorHeight;
        };
        if (this._updater) clearTimeout(this._updater);
        this._updater = setTimeout(updater, 500);
    };

    // scroll to end
    @action.bound scrollToBottom() {
        if (this.chat.canGoDown) {
            this.resetScrolling();
            this.chat.reset();
            return;
        }
        const y = this.contentHeight - this.scrollViewHeight;
        if (y) {
            this.scrollView.scrollTo({ y, animated: true });
        }
    }

    listView() {
        if (chatState.loading) return null;
        const refreshControlTop = this.chat.canGoUp ? (
            <ActivityIndicator size="large" style={{ padding: vars.spacing.small.maxi }}
                onLayout={e => { this.indicatorHeight = e.nativeEvent.layout.height; }} />
        ) : null;
        const refreshControlBottom = this.chat.canGoDown ? (
            <ActivityIndicator size="large" style={{ padding: vars.spacing.small.maxi }} />
        ) : null;
        return (
            <ScrollView
                onLayout={this.layoutScrollView}
                contentContainerStyle={{ opacity: this.initialScrollDone ? 1 : 0 }}
                style={{ flexGrow: 1, flex: 1, backgroundColor: vars.white }}
                initialListSize={1}
                onContentSizeChange={this.contentSizeChanged}
                scrollEnabled={this.scrollEnabled}
                scrollEventThrottle={0}
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="never"
                enableEmptySections
                ref={sv => { this.scrollView = sv; }}>
                {this.chat.canGoUp ? refreshControlTop : this.zeroStateItem}
                {this.data.map(this.item)}
                {this.chat.limboMessages &&
                    this.chat.limboMessages.filter(m => !(m.files && !m.files.length)).map(this.item)}
                {refreshControlBottom}
            </ScrollView>
        );
    }

    @computed get zeroStateItem() {
        const { chat } = this;
        if (chat.isChatCreatedFromPendingDM) return this.zeroStateChatInvite;
        return this.zeroStateChat;
    }

    get zeroStateChat() {
        const zsContainer = {
            borderBottomWidth: 0,
            borderBottomColor: '#CFCFCF',
            marginBottom: vars.spacing.small.midi2x,
            paddingLeft: vars.spacing.medium.mini2x,
            paddingRight: vars.spacing.medium.mini2x
        };
        const { chat } = this;
        const participants = chat.isChannel ? chat.allParticipants : chat.otherParticipants;
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
                <View style={{ flexDirection: 'row', paddingLeft: -marginLeft }}>{avatars}</View>
                <Text style={{
                    textAlign: 'left',
                    marginTop: vars.spacing.small.maxi2x,
                    marginBottom: vars.spacing.small.maxi2x,
                    color: vars.txtDark
                }}>
                    {tx('title_chatBeginning', { chatName: chat.name })}
                </Text>
                <IdentityVerificationNotice fullWidth />
            </View>
        );
    }

    get zeroStateChatInvite() {
        const { chat } = this;
        const participant = chat.otherParticipants[0];
        const { firstName, fullName, addresses } = participant;
        const emojiTada = require('../../assets/emoji/tada.png');
        const container = {
            flex: 1,
            flexGrow: 1,
            paddingTop: vars.dmInvitePaddingTop,
            alignItems: 'center',
            marginBottom: vars.spacing.small.midi
        };
        const emojiStyle = {
            alignSelf: 'center',
            width: vars.iconSizeMedium,
            height: vars.iconSizeMedium,
            marginBottom: vars.spacing.small.mini2x
        };
        const headingStyle = {
            color: vars.lighterBlackText,
            textAlign: 'center',
            fontSize: vars.font.size.bigger,
            lineHeight: 22
        };
        const inviteMethodStyle = {
            marginTop: vars.spacing.medium.mini2x,
            fontSize: vars.font.size.smaller,
            color: vars.textBlack54
        };
        const headingCopy = chat.isNewUserFromInvite ? 'title_newUserDmInviteHeading' : 'title_dmInviteHeading';
        const invteMethodCopy = chat.isAutoAdded ? 'title_userInAddressBook' : 'title_invitedUserViaEmail';
        return (
            <View style={container}>
                <Image source={emojiTada} style={emojiStyle} resizeMode="contain" />
                <Text style={headingStyle}>
                    {tx(headingCopy, { contactName: fullName })}
                </Text>
                {!chat.isReceived &&
                <Text semibold style={inviteMethodStyle}>
                    {tx(invteMethodCopy, { firstName, email: addresses[0] })}
                </Text>}
                <View style={{ marginTop: vars.spacing.medium.maxi, alignItems: 'center' }}>
                    <AvatarCircle contact={participant} medium />
                </View>
                <Text style={{ textAlign: 'center', marginBottom: vars.spacing.medium.maxi2x }}>
                    {participant.usernameTag}
                </Text>
                <IdentityVerificationNotice />
            </View>);
    }

    renderThrow() {
        if (this.chat && this.chat.isInvite) return <DmContactInvite />;
        return (
            <View
                style={{ flexGrow: 1, paddingBottom: vars.spacing.small.mini2x }}>
                {/* this.chat && !this.chat.canGoUp && upgradeForArchive() */}
                <View style={{ flex: 1, flexGrow: 1 }}>
                    {this.data ? this.listView() : !chatState.loading && <ChatZeroStatePlaceholder />}
                </View>
                <ProgressOverlay enabled={/* chatState.loading || */ !this.initialScrollDone} />
            </View>
        );
    }
}

Chat.propTypes = {
    hideInput: PropTypes.bool
};
