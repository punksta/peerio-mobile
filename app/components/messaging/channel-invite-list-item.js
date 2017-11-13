import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { chatInviteStore, User } from '../../lib/icebear';
import { tx } from '../utils/translator';
import CircleButtonWithIcon from '../controls/circle-button-with-icon';

@observer
export default class ChannelInviteListItem extends SafeComponent {
    async acceptInvite(id) {
        await chatInviteStore.acceptInvite(id);
    }

    renderThrow() {
        const { invitation } = this.props;
        if (!invitation) return null;
        const { kegDbId, channelName, username } = invitation;
        const containerStyle = {
            paddingLeft: vars.spacing.medium.mini2x,
            paddingRight: vars.spacing.medium.maxi2x,
            paddingVertical: vars.spacing.medium.mini,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: vars.lightGrayBg,
            backgroundColor: vars.white,
            flexDirection: 'row'
        };

        const textStyle = {
            fontSize: vars.font.size.bigger,
            color: vars.txtDark,
            marginBottom: 4
        };

        const smallTextStyle = {
            color: vars.txtDate,
            fontSize: vars.font.size.smaller
        };

        const actionButtonStyle = {
            flexDirection: 'row',
            flex: 1,
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'flex-end'
        };
        console.log(`kegDbID: `, invitation);
        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity style={containerStyle} pressRetentionOffset={vars.pressRetentionOffset}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4 }}>
                        <View>
                            <Text style={textStyle}>
                                {`# ${channelName}`}
                            </Text>
                            <Text style={smallTextStyle}>
                                {tx('title_invitedBy', { username })}
                            </Text>
                        </View>
                        {(User.current.channelsLeft > 0) ?
                            <View style={actionButtonStyle}>
                                <CircleButtonWithIcon
                                    name="clear"
                                    iconColor="white"
                                    onPress={() => chatInviteStore.rejectInvite(kegDbId)}
                                    radius={vars.iconSize}
                                    margin={vars.iconSizeBigger}
                                    bgColor="gray"
                                />
                                <CircleButtonWithIcon
                                    name="done"
                                    iconColor="white"
                                    onPress={() => this.acceptInvite(kegDbId)}
                                    radius={vars.iconSize}
                                    margin={0}
                                    bgColor={vars.bg}
                                />
                            </View>
                        :
                            <View style={actionButtonStyle}>
                                <CircleButtonWithIcon
                                    name="info"
                                    iconColor="gray"
                                    iconSize={vars.iconSizeBigger}
                                    radius={vars.iconSizeBigger}
                                    margin={0}
                                    bgColor="white"
                                />
                            </View>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

ChannelInviteListItem.propTypes = {
    invitation: PropTypes.any.isRequired
};
