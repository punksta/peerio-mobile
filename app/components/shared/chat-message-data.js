import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';

const containerStyle = {
    borderWidth: 0,
    borderColor: 'yellow',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 22
};

const fullnameTextStyle = {
    color: vars.txtDark,
    fontSize: vars.font.size.normal
};

const usernameTextStyle = {
    color: vars.txtMedium,
    fontSize: vars.font.size.normal,
    fontWeight: 'normal'
};

const dateTextStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.txtDate,
    marginLeft: vars.spacing.small.midi2x
};

@observer
export default class ChatMessageData extends SafeComponent {
    renderThrow() {
        const { sender, messageTimestampText } = this.props.message;
        return (
            <View style={containerStyle}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                    <Text bold style={fullnameTextStyle}>
                        {sender.fullName}
                    </Text>
                    {` `}
                    <Text italic style={usernameTextStyle}>
                        {sender.username}
                    </Text>
                </Text>
                <Text style={dateTextStyle}>
                    {messageTimestampText}
                </Text>
            </View>
        );
    }
}

ChatMessageData.propTypes = {
    message: PropTypes.any
};
