import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { observer } from 'mobx-react/native';
import { User } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import { tx, T } from '../utils/translator';
import settingsState from '../settings/settings-state';
import { vars } from '../../styles/styles';
import { gradient } from '../controls/effects';

@observer
export default class ChannelUpgradeOffer extends Component {
    // TODO
    render() {
        if (User.current.channelLimit === Number.MAX_SAFE_INTEGER) return null;
        if (process.env.PEERIO_DISABLE_PAYMENTS) return null;

        const container = {
            flexGrow: 1,
            flex: 1,
            flexDirection: 'row',
            paddingVertical: vars.spacing.small.maxi,
            paddingHorizontal: vars.spacing.medium.maxi2x
        };

        const offerStyle = {
            maxWidth: '77.5%',
            marginRight: vars.spacing.medium.maxi2x
        };

        const offerTextStyle = {
            color: 'white',
            fontSize: vars.font.size.smaller,
            lineHeight: 20,
            textAlign: 'justify',
            // Padding is due to React JS bug with lineHeight on android
            paddingBottom: Platform.OS === 'android' ? vars.spacing.small.midi : 0
        };

        const buttonStyle = {
            maxWidth: '22.5%',
            justifyContent: 'center',
            marginTop: vars.spacing.medium.midi2x
        };

        return (gradient({},
            <View style={container}>
                <View style={offerStyle}>
                    <Text style={offerTextStyle}>
                        <T k="title_channelUpgradeOffer">{{ limit: User.current.channelLimit }}</T>
                    </Text>
                </View>
                <View style={buttonStyle}>
                    {buttons.uppercaseWhiteButtonNoPadding(tx('button_upgrade'), () => settingsState.upgrade(), false, { fontWeight: '600' })}
                </View>
            </View>
        ));
    }
}
