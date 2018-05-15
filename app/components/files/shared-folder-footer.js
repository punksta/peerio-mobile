import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tu } from '../utils/translator';
import icons from '../helpers/icons';
import SharedWithRow from '../shared/shared-with-row';
import uiState from '../layout/ui-state';
import Text from '../controls/custom-text';

@observer
export default class SharedFolderFooter extends SafeComponent {
    renderThrow() {
        const { title, action, icon, showAvatars } = this.props;
        // TODO remove mock contacts and rooms when SDK is wired
        const mockContacts = [
            // contactStore.getContact('karim94'),
            // contactStore.getContact('test_karim'),
            // contactStore.getContact('karim_dev'),
            // contactStore.getContact('karim94'),
            // contactStore.getContact('test_karim'),
            // contactStore.getContact('karim_dev')
        ];
        const mockRooms = [
            // 1,
            // 2,
            // 3,
            // 4
        ];

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
                {showAvatars && <SharedWithRow contacts={mockContacts} rooms={mockRooms} />}
            </TouchableOpacity>);
    }
}

SharedFolderFooter.propTypes = {
    title: PropTypes.any,
    action: PropTypes.func,
    icon: PropTypes.string,
    showAvatars: PropTypes.bool
};
