import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import chatState from './chat-state';

@observer
export default class ChatSectionHeader extends SafeComponent {
    renderThrow() {
        const { title, collapsible } = this.props;
        const style = {
            paddingLeft: vars.spacing.medium.midi,
            paddingRight: vars.spacing.medium.mini2x,
            height: 48,
            justifyContent: 'space-between',
            backgroundColor: vars.lightGrayBg,
            flexDirection: 'row',
            alignItems: 'center'
        };

        const textStyle = {
            fontSize: 16,
            fontWeight: vars.font.weight.semiBold,
            color: vars.txtMedium
        };

        const action = collapsible ? () => { chatState[this.props.state] = !chatState[this.props.state]; } : null;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                {...this.props} style={style} onPress={action} disabled={!collapsible}>
                <Text style={textStyle}>{title}</Text>
                {collapsible &&
                <Icon name={chatState[this.props.state] ? 'arrow-drop-down' : 'arrow-drop-up'} size={24} style={{ color: vars.txtDark }} />}
            </TouchableOpacity>
        );
    }
}

ChatSectionHeader.propTypes = {
    title: PropTypes.any
};
