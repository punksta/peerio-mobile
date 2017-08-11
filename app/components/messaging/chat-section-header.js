import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class ChatSectionHeader extends SafeComponent {
    renderThrow() {
        const { title } = this.props;
        const style = {
            height: 48,
            justifyContent: 'center',
            backgroundColor: vars.white,
            borderBottomWidth: 1,
            borderBottomColor: vars.txtDate
        };

        const textStyle = {
            marginLeft: 25,
            fontWeight: 'bold',
            color: vars.txtMedium
        };
        return (
            <View style={style}>
                <Text style={textStyle}>{title}</Text>
            </View>
        );
    }
}

ChatSectionHeader.propTypes = {
    title: PropTypes.any
};
