import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import { User } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import { tx, T } from '../utils/translator';

@observer
export default class ChannelUpgradeOffer extends Component {
    render() {
        if (User.current.channelLimit === Number.MAX_SAFE_INTEGER) return null;

        const offerStyle = {
            backgroundColor: '#d9f1ef',
            padding: 12
        };

        return (
            <View style={offerStyle}>
                <Text>
                    <T k="title_channelUpgradeOffer">{{ limit: User.current.channelLimit }}</T>
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {buttons.uppercaseBlueButton(tx('button_upgrade'))}
                </View>
            </View>
        );
    }
}
