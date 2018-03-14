import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tu } from '../utils/translator';
import icons from '../helpers/icons';

@observer
export default class SharedFolderFooter extends SafeComponent {
    renderThrow() {
        const { title, action, icon } = this.props;
        const bottomRowStyle = {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: vars.spacing.small.mini,
            borderColor: vars.verySubtleGrey,
            borderTopWidth: 1,
            backgroundColor: vars.white
        };
        const iconStyle = {
            paddingLeft: vars.spacing.medium.mini,
            paddingRight: vars.spacing.small.mini
        };
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.pressRetentionOffset}
                style={bottomRowStyle}
                onPress={action} >
                {icon && icons.plaindark(icon, vars.iconSize, iconStyle)}
                <View style={{ padding: vars.spacing.medium.mini }}>
                    <Text style={{ fontWeight: 'bold', color: vars.bg }}>
                        {tu(title)}
                    </Text>
                </View>
            </TouchableOpacity>);
    }
}

SharedFolderFooter.propTypes = {
    title: PropTypes.any,
    action: PropTypes.func,
    icon: PropTypes.string
};
