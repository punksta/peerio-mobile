import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class ChatChannelInvitesSection extends SafeComponent {
    renderThrow() {
        const { data, onPress, title } = this.props;
        if (!data || data <= 0) return null;

        const style = {
            height: 48,
            paddingLeft: vars.spacing.medium.midi,
            paddingRight: vars.spacing.medium.mini2x,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: vars.lightGrayBg,
            flexDirection: 'row'
        };

        const textStyle = {
            color: vars.txtDark
        };

        const circleRadius = 12;
        const circleStyle = {
            width: circleRadius * 2,
            height: circleRadius * 2,
            borderRadius: circleRadius,
            backgroundColor: vars.bg,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textCircleStyle = {
            fontSize: vars.font.size.small,
            fontWeight: 'bold',
            color: vars.white
        };

        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity disabled={!onPress} onPress={onPress} style={style} pressRetentionOffset={vars.pressRetentionOffset}>
                    <Text style={textStyle}>{title}</Text>
                    {onPress && <View style={circleStyle}><Text style={textCircleStyle}>{data}</Text></View>}
                </TouchableOpacity>
            </View>
        );
    }
}

ChatChannelInvitesSection.propTypes = {
    data: PropTypes.any,
    title: PropTypes.any,
    onPress: PropTypes.any
};
