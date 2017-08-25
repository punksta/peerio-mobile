import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { chatInviteStore } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import { tx } from '../utils/translator';

@observer
export default class ChannelInviteListItem extends SafeComponent {
    renderThrow() {
        const { invitation } = this.props;
        if (!invitation) return null;
        const { kegDbId, channelName, username, timestamp } = invitation;
        const containerStyle = {
            paddingLeft: 24,
            paddingRight: 10,
            paddingVertical: 12,
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
            fontSize: 12
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
                                {buttons.uppercaseBlueButtonNoPadding(tx('button_accept'), () => chatInviteStore.acceptInvite(kegDbId))}
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
