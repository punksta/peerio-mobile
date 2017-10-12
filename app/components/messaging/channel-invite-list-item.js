import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { chatInviteStore, chatStore } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import routerMain from '../routes/router-main';
import { tx } from '../utils/translator';

@observer
export default class ChannelInviteListItem extends SafeComponent {
    async acceptInvite(id) {
        await chatInviteStore.acceptInvite(id);
        routerMain.chats(chatStore.activeChat);
    }

    renderThrow() {
        const { invitation } = this.props;
        if (!invitation) return null;
        const { kegDbId, channelName, username, timestamp } = invitation;
        const containerStyle = {
            paddingLeft: 24,
            paddingRight: vars.spacing.big,
            paddingVertical: vars.spacing.bigger,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: vars.lightGrayBg,
            backgroundColor: vars.white,
            flexDirection: 'row'
        };

        const textStyle = {
            color: vars.txtDark
        };

        const smallTextStyle = {
            color: vars.txtDate,
            fontSize: vars.font.size.smaller
        };
        console.log(`kegDbID: `, invitation);
        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity style={containerStyle} pressRetentionOffset={vars.pressRetentionOffset}>
                    <View style={{ flexGrow: 1 }}>
                        <Text style={textStyle}>
                            {`# ${channelName}`}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={smallTextStyle}>
                                {tx('title_invitedBy', { username,
                                    timestamp: `\n${moment(timestamp).format('llll')}` })}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {buttons.uppercaseBlueButtonNoPadding(tx('button_accept'), () => this.acceptInvite(kegDbId))}
                                {buttons.uppercaseGrayButtonNoPadding(tx('button_decline'), () => chatInviteStore.rejectInvite(kegDbId))}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

ChannelInviteListItem.propTypes = {
    invitation: PropTypes.any.isRequired
};
