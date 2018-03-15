import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tu } from '../utils/translator';
import icons from '../helpers/icons';
import ReadReceipt from '../shared/read-receipt';
import uiState from '../layout/ui-state';

@observer
export default class SharedFolderFooter extends SafeComponent {
    get sharedWithAvatars() {
        const usersSharedWith = this.props.contacts;
        if (!usersSharedWith || !usersSharedWith.length) return null;
        const receiptRow = {
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: vars.spacing.medium.mini2x
        };
        return (
            <View style={receiptRow}>
                {usersSharedWith.map(r => (
                    <View key={r.username} style={{ flex: 0, alignItems: 'flex-end' }}>
                        <ReadReceipt username={r.username} />
                    </View>
                ))}
            </View>
        );
    }

    renderThrow() {
        const { title, action, icon } = this.props;
        const bottomRowStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: vars.spacing.small.mini,
            borderColor: vars.verySubtleGrey,
            borderTopWidth: 1,
            backgroundColor: vars.white,
            paddingBottom: uiState.keyboardHeight ? 0 : vars.iPhoneXBottom
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
                {this.sharedWithAvatars}
            </TouchableOpacity>);
    }
}

SharedFolderFooter.propTypes = {
    title: PropTypes.any,
    action: PropTypes.func,
    icon: PropTypes.string
};
