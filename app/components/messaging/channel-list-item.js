import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import chatState from './chat-state';
import { User, contactStore } from '../../lib/icebear';

@observer
export default class ChannelListItem extends SafeComponent {
    renderThrow() {
        const { chat } = this.props;
        const { title } = chat;
        if (!chat) return null;
        const containerStyle = {
            height: 40,
            paddingHorizontal: 24,
            justifyContent: 'center',
            backgroundColor: vars.lightGrayBg
        };

        const textStyle = {
            color: vars.txtDark
        };

        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity style={containerStyle} pressRetentionOffset={vars.pressRetentionOffset}>
                    <Text style={textStyle}>
                        {`# ${title}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

ChannelListItem.propTypes = {
    chat: PropTypes.any.isRequired
};
