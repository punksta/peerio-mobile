import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { fileStore } from '../../lib/icebear';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';
import routes from '../routes/routes';

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

@observer
export default class FolderInlineContainer extends SafeComponent {
    get folder() {
        const { folderId } = this.props;
        return fileStore.folders.getById(folderId);
    }

    @action.bound press() {
        const { folder } = this;
        fileState.currentFolder = folder;
        routes.main.files();
    }

    fileDetails() {
        // TODO add props
        const { folderName } = this.props;
        const { folder } = this;
        const { isBlocked } = folder;
        const nameStyle = {
            flexGrow: 1,
            flexShrink: 1,
            color: isBlocked ? vars.extraSubtleText : vars.txtDark,
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.bold,
            marginLeft: isBlocked ? 0 : vars.spacing.small.midi2x
        };
        const infoStyle = {
            color: vars.extraSubtleText,
            fontSize: vars.font.size.smaller,
            fontWeight: vars.font.weight.regular,
            fontStyle: 'italic'
        };
        if (isBlocked) {
            return (
                <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: vars.spacing.small.midi2x }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={nameStyle}>{folderName}</Text>
                    <Text style={infoStyle}>
                        {tx('title_locked')}
                    </Text>
                </View>);
        }
        return (<Text numberOfLines={1} ellipsizeMode="tail" style={nameStyle}>{folderName}</Text>);
    }

    render() {
        const { folder } = this;
        const { isBlocked } = folder;
        const outer = {
            padding
        };
        const header = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 38
        };
        // TODO Folder action sheet when folder sharing is enabled
        // const optionsIcon = hideMoreOptionsIcon ? null : (
        //     <View style={{ flex: 0 }}>
        //         {icons.dark(
        //             'more-vert',
        //             !isBlocked ? onFolderActionPress : null,
        //             !isBlocked ? null : { opacity: 0.38 })}
        //     </View>);
        const optionsIcon = (
            <View style={{ flex: 0 }}>
                {icons.dark(
                    'more-vert',
                    null,
                    !isBlocked ? null : { opacity: 0.38 })}
            </View>);
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.pressRetentionOffset}
                style={container}
                disabled={isBlocked}
                onPress={this.press}>
                <View style={outer} {...this.props}>
                    <View style={header}>
                        {icons.darkNoPadding(
                            'folder-shared',
                            null,
                            !isBlocked ? null : { opacity: 0.38 },
                            vars.iconSize)}
                        {this.fileDetails()}
                        {/* optionsIcon */}
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
