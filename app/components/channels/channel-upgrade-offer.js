import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import buttons from '../helpers/buttons';

@observer
export default class ChannelUpgradeOffer extends Component {
    render() {
        const offerStyle = {
            backgroundColor: '#d9f1ef',
            padding: 12
        };
        return (
            <View style={offerStyle}>
                <Text>
                    {`👋 Hi there, basic Peerio accounts have access to`}
                    <Text style={{ fontWeight: 'bold' }}> 2 free channels</Text>, enjoy 1 more channel on this account!
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    {buttons.uppercaseBlueButton('Upgrade')}
                </View>
            </View>
        );
    }
}
