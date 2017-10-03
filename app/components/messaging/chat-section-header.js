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
        const { title } = this.props;
        const style = {
            paddingLeft: 18,
            paddingRight: 16,
            height: 48,
            justifyContent: 'space-between',
            backgroundColor: vars.lightGrayBg,
            flexDirection: 'row',
            alignItems: 'center'
        };

        const textStyle = {
            color: vars.txtMedium
        };
        return (
            <TouchableOpacity {...this.props} style={style} onPress={() => { chatState[this.props.state] = !chatState[this.props.state]; }}>
                <Text style={textStyle}>{title}</Text>
                <Icon name={chatState[this.props.state] ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} style={{ color: vars.txtDark }} />
            </TouchableOpacity>
        );
    }
}

ChatSectionHeader.propTypes = {
    title: PropTypes.any
};
