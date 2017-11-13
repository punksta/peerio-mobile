import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { vars } from '../../styles/styles';

export default class IdentityVerificationNotice extends Component {
    verificationLink = 'https://peerio.zendesk.com/hc/en-us/articles/204480655-Verifying-a-Peerio-ID-';

    idVerificationContainer = {
        color: vars.txtMedium,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vars.spacing.small.midi,
        marginBottom: vars.spacing.small.midi,
        marginLeft: vars.spacing.small.maxi2x,
        marginRight: vars.spacing.small.maxi2x
    };

    securityIcon = {
        margin: vars.spacing.small.mini,
        marginRight: vars.spacing.small.midi
    };

    idVerificationText = {
        flex: 9
    };

    hyperlink = {
        textDecorationLine: 'underline'
    };

    render() {
        return (
            <View style={this.idVerificationContainer} >
                <Icon style={this.securityIcon}
                    name="security"
                    size={vars.iconSize}
                    color="gray"
                />
                <Text style={this.idVerificationText}>
                    <Text>
                        You can verify any user’s identity with their Peerio ID#.
                        &nbsp;
                    </Text>
                    <Text
                        style={this.hyperlink}
                        onPress={() => Linking.openURL(this.verificationLink)}>
                        Show me how
                    </Text>
                </Text>
            </View>
        );
    }
}
