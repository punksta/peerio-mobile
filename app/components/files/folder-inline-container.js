import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { fileStore } from '../../lib/icebear';
import { tx } from '../utils/translator';
import routes from '../routes/routes';
import FoldersActionSheet from './folder-action-sheet';
import buttons from '../helpers/buttons';
import Text from '../controls/custom-text';

const padding = 8;
const borderWidth = 1;

const container = {
    flex: 1,
    flexGrow: 1,
    borderColor: vars.lightGrayBg,
    borderWidth,
    borderRadius: 2
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
        return fileStore.folderStore.getById(folderId);
    }

    @action.bound press() {
        const { folder } = this;
        fileStore.folderStore.currentFolder = folder;
        routes.main.files();
    }

    get fileDetails() {
        const { folder } = this;
        const { name } = folder;
        const nameStyle = {
            flexGrow: 1,
            flexShrink: 1,
            color: vars.txtDark,
            fontSize: vars.font.size.normal,
            marginLeft: vars.spacing.small.midi2x
        };
        return (<Text numberOfLines={1} ellipsizeMode="tail" style={nameStyle}>{name}</Text>);
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
                {this.fileDetails}
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
        if (!folder) return null;
        const outer = {
            flex: 1,
            flexGrow: 1,
            padding
        };

        return (
            <TouchableOpacity
                pressRetentionOffset={vars.pressRetentionOffset}
                style={container}
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
