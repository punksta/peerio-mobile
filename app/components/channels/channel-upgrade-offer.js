import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import { User } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import chatState from '../messaging/chat-state';
import { t, tx } from '../utils/translator';

@observer
export default class ChannelUpgradeOffer extends Component {
    render() {
        const defaultChannelLimit = 2;
        const limitReached = User.current.channelLimit >= defaultChannelLimit;
        const leftChannels = User.current.channelLimit - chatState.store.channels.length;
        const offerStyle = {
            backgroundColor: '#d9f1ef',
            padding: 12
        };

        let channelLimitView = (
            <View style={offerStyle}>
                <Text>
                    {`👋 Hi there, basic Peerio accounts have access to`}
                    <Text style={{ fontWeight: 'bold' }}> {defaultChannelLimit} free channels</Text>, enjoy {leftChannels} more channel on this account!
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {buttons.uppercaseBlueButton(tx('button_upgrade'))}
                </View>
            </View>
        );
        if (User.current.channelLimit > defaultChannelLimit && leftChannels > defaultChannelLimit) {
            channelLimitView = (
                <View style={offerStyle}>
                    <Text>
                        {`👋 Hi there, your account has access to`}
                        <Text style={{ fontWeight: 'bold' }}> {User.current.channelLimit} channels</Text>, enjoy {leftChannels} more channel on this account!
                </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {buttons.uppercaseBlueButton(tx('button_upgrade'))}
                    </View>
                </View>
            );
        }
        if (leftChannels <= 0) {
            channelLimitView = (
                <View style={offerStyle}>
                    <Text>
                        {`You have reached your channel limit of `}
                        <Text style={{ fontWeight: 'bold' }}> {User.current.channelLimit} channels</Text>, please upgrade.
                </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {buttons.uppercaseBlueButton(tx('button_upgrade'))}
                    </View>
                </View>
            );
        }
        if (leftChannels > defaultChannelLimit) {
            channelLimitView = null;
        }
        return channelLimitView;
    }
}
