import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

const padding = 8;
const borderWidth = 1;

const container = {
    borderColor: vars.lightGrayBg,
    borderWidth,
    marginVertical: 4,
    borderRadius: 2,
    marginLeft: 68,
    marginRight: 22
};

const text = {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: vars.font.size.normal,
    fontWeight: vars.font.weight.semiBold,
    color: vars.txtMedium,
    paddingLeft: padding
};

export default class FolderInlineContainer extends SafeComponent {
    render() {
        const { folderName } = this.props;
        const outer = {
            padding
        };
        const header = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 30
        };
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.pressRetentionOffset}
                style={container}>
                <View style={outer} {...this.props}>
                    <View style={header}>
                        {icons.darkNoPadding('folder-shared', null, null, vars.iconSize)}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={text}>{folderName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

FolderInlineContainer.propTypes = {
    file: PropTypes.any,
    onLayout: PropTypes.any,
    extraActionIcon: PropTypes.any,
    onAction: PropTypes.any,
    isImage: PropTypes.bool,
    isOpen: PropTypes.bool
};
