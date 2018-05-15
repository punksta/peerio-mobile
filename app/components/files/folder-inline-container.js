import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { fileStore } from '../../lib/icebear';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';
import routes from '../routes/routes';
import FoldersActionSheet from './folders-action-sheet';
import buttons from '../helpers/buttons';
import Text from '../controls/custom-text';

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

const header = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 38
};

const infoStyle = {
    color: vars.extraSubtleText,
    fontSize: vars.font.size.smaller
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
            marginLeft: isBlocked ? 0 : vars.spacing.small.midi2x
        };
        if (isBlocked) {
            return (
                <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: vars.spacing.small.midi2x }}>
                    <Text bold numberOfLines={1} ellipsizeMode="tail" style={nameStyle}>{folderName}</Text>
                    <Text italic style={infoStyle}>
                        {tx('title_locked')}
                    </Text>
                </View>);
        }
        return (<Text numberOfLines={1} ellipsizeMode="tail" style={nameStyle}>{folderName}</Text>);
    }

    @action.bound onAction() {
        FoldersActionSheet.show(this.folder);
    }

    @action.bound reshare() {
        const { folder } = this;
        folder.isShared = true;
        folder.isJustUnshared = false;
    }

    get normalBody() {
        const { folder } = this;
        const { isBlocked } = folder;

        const optionsIcon = (
            <View style={{ flex: 0 }}>
                {icons.dark(
                    'more-vert',
                    this.onAction,
                    !isBlocked ? null : { opacity: 0.38 })}
            </View>);
        return (
            <View style={header}>
                {icons.darkNoPadding(
                    'folder-shared',
                    null,
                    !isBlocked ? null : { opacity: 0.38 },
                    vars.iconSize)}
                {this.fileDetails()}
                {optionsIcon}
            </View>
        );
    }

    get reshareBody() {
        const { folder } = this;
        const { isBlocked } = folder;
        return (
            <View style={header}>
                {icons.darkNoPadding(
                    'folder',
                    null,
                    !isBlocked ? null : { opacity: 0.38 },
                    vars.iconSize)}
                <View style={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ marginLeft: vars.spacing.small.midi2x }}>
                        <Text style={infoStyle}>
                            {tx('title_folderUnshared')}
                        </Text>
                    </View>
                    <View>
                        {buttons.uppercaseBlueButton(tx('button_reshare'), this.reshare)}
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { folder } = this;
        const { isBlocked } = folder;
        const outer = {
            padding
        };

        return (
            <TouchableOpacity
                pressRetentionOffset={vars.pressRetentionOffset}
                style={container}
                disabled={isBlocked}
                onPress={this.press}>
                <View style={outer} {...this.props}>
                    {folder.isJustUnshared ? this.reshareBody : this.normalBody}
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
