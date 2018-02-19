import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import chatState from '../messaging/chat-state';

@observer
export default class ChatInfoSectionHeading extends SafeComponent {
    renderThrow() {
        const { title, state, collapsible } = this.props;
        if (!title) return null;
        const style = {
            flex: 1,
            flexDirection: 'row',
            height: 48,
            marginTop: 8,
            marginBottom: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: vars.white,
            marginLeft: vars.spacing.medium.mini2x,
            marginRight: vars.spacing.medium.mini2x
        };

        const textStyle = {
            fontWeight: 'bold',
            color: vars.subtleText
        };

        const action = collapsible ? () => { chatState[state] = !chatState[state]; } : null;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                style={style} onPress={action} disabled={!collapsible}>
                <Text style={textStyle}>{title}</Text>
                {collapsible &&
                <Icon name={chatState[state] ? 'arrow-drop-down' : 'arrow-drop-up'} size={24} style={{ color: vars.subtleText }} />}
            </TouchableOpacity>
        );
    }
}

ChatInfoSectionHeading.propTypes = {
    title: PropTypes.any,
    state: PropTypes.any
};
