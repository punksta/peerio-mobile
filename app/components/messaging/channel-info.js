import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { observable } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';
import { config } from '../../lib/icebear';
import ChannelInfoListState from '../channels/channel-info-list-state';
import testLabel from '../helpers/test-label';
import imagePopups from '../shared/image-popups';

const leaveRoomImage = require('../../assets/chat/icon-M-leave.png');

const textStyle = {
    color: vars.txtDate,
    marginTop: vars.spacing.small.maxi,
    fontSize: vars.font.size.smaller,
    marginLeft: vars.spacing.medium.midi
};

const topicTextStyle = {
    color: vars.txtDark,
    margin: vars.spacing.medium.midi,
    fontSize: vars.font.size.normal
};

@observer
export default class ChannelInfo extends SafeComponent {
    @observable channelTopic = '';
    @observable chat = null;

    componentWillMount() {
        this.chat = chatState.currentChat;
        if (!this.chat) return;
        this.channelTopic = this.chat.purpose;
    }

    addMembers = () => {
        chatState.routerModal.channelAddPeople();
    };

    leaveChannel = async () => {
        const confirmLeave = await imagePopups.confirmLeave();
        if (confirmLeave) {
            chatState.routerMain.chats();
            await chatState.routerModal.discard();
            await this.chat.leave();
        }
    };

    deleteChannel = async () => {
        const confirmDelete = await imagePopups.confirmDelete();
        if (confirmDelete) {
            chatState.routerMain.chats();
            await chatState.routerModal.discard();
            await this.chat.delete();
        }
    };

    lineBlock(content, noBorder) {
        const s = {
            borderBottomWidth: noBorder ? 0 : 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    get spacer() {
        return <View style={{ height: 8 }} />;
    }

    action(title, icon, action, image) {
        const containerStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: vars.spacing.medium.mini2x,
            height: vars.sectionHeaderHeight
        };
        return (
            <View style={{ backgroundColor: vars.chatItemPressedBackground }}>
                <TouchableOpacity
                    style={{ backgroundColor: vars.channelInfoBg }}
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={action}
                    {...testLabel(title)} >
                    <View style={containerStyle}>
                        {icon ?
                            icons.darkNoPadding(icon, action) :
                            icons.imageButtonNoPadding(image, action)}
                        <Text style={{ marginLeft: vars.spacing.medium.maxi2x, color: vars.lighterBlackText }}>
                            {title}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    get topicTextBox() {
        const chat = chatState.currentChat;
        const update = () => {
            chat.changePurpose(this.channelTopic);
        };
        const placeholderStyle = {
            paddingLeft: vars.spacing.medium.midi,
            height: vars.inputHeight,
            color: vars.txtDark,
            fontFamily: vars.peerioFontFamily
        };
        return (
            <View>
                <Text bold style={textStyle}>{tx('title_purpose')}</Text>
                <TextInput
                    onChangeText={text => { this.channelTopic = text; }}
                    onBlur={update}
                    onEndEditing={update}
                    value={this.channelTopic}
                    style={placeholderStyle}
                    maxLength={config.chat.maxChatPurposeLength} />
            </View>
        );
    }

    get topicTextView() {
        return (
            <View>
                <Text bold style={textStyle}>{tx('title_purpose')}</Text>
                <Text style={topicTextStyle}>{this.channelTopic}</Text>
            </View>
        );
    }

    renderThrow() {
        const { chat } = this;
        if (!chat) return null;
        const { canIAdmin, canILeave } = chat;
        const body = (
            <View style={{ backgroundColor: vars.channelInfoBg }}>
                {this.lineBlock(canIAdmin ? this.topicTextBox : this.topicTextView)}
                {this.lineBlock(
                    <View>
                        {this.spacer}
                        {canIAdmin && this.action(tx('button_inviteToChannel'), 'person-add', this.addMembers)}
                        {canILeave && this.action(tx('button_leaveChannel'), null, this.leaveChannel, leaveRoomImage)}
                        {canIAdmin && this.action(tx('button_deleteChannel'), 'delete', this.deleteChannel)}
                        {this.spacer}
                    </View>)
                }
                <ChannelInfoListState />
            </View>
        );
        return (<LayoutModalExit
            body={body}
            title={`# ${chatState.title}`}
            onClose={() => chatState.routerModal.discard()} />);
    }
}
