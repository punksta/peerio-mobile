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
    borderRadius: 2,
    marginVertical: 4
};

const header = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: vars.inlineFolderContainerHeight
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
        const optionsIcon = (
            <View style={{ flex: 0 }}>
                {icons.dark('more-vert', this.onAction)}
            </View>);
        return (
            <View style={header}>
                {icons.darkNoPadding('folder-shared')}
                {this.fileDetails}
                {optionsIcon}
            </View>
        );
    }

    get unsharedBody() {
        const text = this.folder ?
            tx('title_folderNameUnshared', { folderName: this.folder.name }) : tx('title_folderUnshared');
        return (
            <View style={header}>
                {icons.darkNoPadding('folder')}
                <View style={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ marginLeft: vars.spacing.small.midi2x }}>
                        <Text style={infoStyle}>
                            {text}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    get reshareBody() {
        return (
            <View style={header}>
                {icons.darkNoPadding('folder')}
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
        if (!folder) return this.unsharedBody;
        const outer = {
            flex: 1,
            flexGrow: 1,
            paddingHorizontal: padding
        };

        return (
            <TouchableOpacity
                pressRetentionOffset={vars.pressRetentionOffset}
                style={container}
                onPress={this.press}>
                <View style={outer} {...this.props}>
                    {folder.isShared ? this.normalBody : this.unsharedBody}
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
