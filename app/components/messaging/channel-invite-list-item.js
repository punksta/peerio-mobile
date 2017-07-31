import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import chatState from './chat-state';
import { User, contactStore } from '../../lib/icebear';

@observer
export default class ChannelInviteListItem extends SafeComponent {
    renderThrow() {
        const { chat } = this.props;
        const { title } = chat;
        if (!chat) return null;
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

        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity style={containerStyle} pressRetentionOffset={vars.pressRetentionOffset}>
                    <View style={{ flexGrow: 1 }}>
                        <Text style={textStyle}>
                            {`# ${title}`}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={smallTextStyle}>Invited by {chat.invitedBy.fullName}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {buttons.uppercaseBlueButtonNoPadding('Accept')}
                                {buttons.uppercaseGrayButtonNoPadding('Reject')}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

ChannelInviteListItem.propTypes = {
    chat: PropTypes.any.isRequired
};
