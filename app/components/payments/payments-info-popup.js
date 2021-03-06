import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { config } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { a } from '../controls/tag-handlers';

const popupTextStyle = {
    color: vars.txtDark,
    fontSize: vars.font.size.smaller
};

const linkStyle = [popupTextStyle, {
    textDecorationLine: 'underline',
    color: vars.peerioBlue
}];

@observer
export default class PaymentsInfoPopup extends Component {
    render() {
        return (
            <ScrollView style={{ maxHeight: vars.height80 }}>
                <Text style={popupTextStyle}>
                    {this.props.text}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {a(tx('title_termsOfUse'), config.translator.urlMap.openTerms, linkStyle)}
                    <Text style={popupTextStyle}>   |   </Text>
                    {a(tx('title_privacyPolicy'), config.translator.urlMap.openPrivacy, linkStyle)}
                </View>
            </ScrollView>
        );
    }
}
