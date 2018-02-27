import React from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { observable, action, when } from 'mobx';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routerModal from '../routes/router-modal';
import { popupInput } from '../shared/popups';
import { fileHelpers } from '../../lib/icebear';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import routerMain from '../routes/router-main';

@observer
export default class FoldersActionSheet extends SafeComponent {
    DELETE_INDEX = 2;
    CANCEL_INDEX = 3;

    // TODO add folder sharing when it has been implemented
    get items() { return [this.moveFolder, this.renameFolder, this.deleteFolder, this.cancel]; }

    get cancel() { return { title: tx('button_cancel') }; }

    get moveFolder() {
        return {
            title: tx('button_move'),
            action: () => {
                fileState.currentFile = this.folder;
                routerModal.moveFileTo();
            }
        };
    }

    get renameFolder() {
        return {
            title: tx('button_rename'),
            action: async () => {
                const { folder } = this;
                const newFolderName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(folder.name)
                );
                if (newFolderName) {
                    await folder.rename(`${newFolderName}`);
                }
            }
        };
    }

    get deleteFolder() {
        return {
            title: tx('button_delete'),
            action: async () => {
                fileState.store.folders.deleteFolder(this.folder);
            }
        };
    }

    onPress = index => {
        if (this.items[index]) {
            const { action: pressAction } = this.items[index];
            pressAction && pressAction();
        }
    };

    @observable folder = null;
    @observable _actionSheet = null;

    /**
     * We need to re-render and re-ref action sheet
     * so that the title is updated accordingly
     * @param {File} folder
     */
    @action.bound show(folder) {
        if (!folder) {
            console.error(`folders-action-sheet: folder is undefined`);
            return;
        }
        if (this._showWhen) {
            this._showWhen();
            this._showWhen = null;
        }
        this._actionSheet = null;
        this.folder = folder;
        this._showWhen = when(() => this._actionSheet, () => this._actionSheet.show());
    }

    onFolderInfoPress = () => {
        const { folder } = this;
        this._actionSheet.hide();
        routerModal.discard();
        routerMain.files(folder);
    };

    get title() { return Platform.OS === 'android' ? this.titleAndroid() : this.titleIOS(); }

    titleAndroid() {
        const { folder } = this;
        const containerStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'row'
        };
        const infoIconStyle = {
            position: 'absolute',
            right: 16,
            top: 8,
            bottom: 8
        };
        const titleTextStyle = {
            fontSize: vars.font.size.smaller,
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: vars.spacing.small.mini,
            lineHeight: 18
        };
        const folderSizeText = folder.size ?
            this.folder.sizeFormatted :
            tx('title_empty');
        return (
            <TouchableOpacity style={containerStyle} onPress={this.onFolderInfoPress}>
                <View style={containerStyle}>
                    <Text style={[containerStyle, titleTextStyle]}>
                        {`${folder.name}\n${folderSizeText} ${moment(folder.uploadedAt).format('DD/MM/YYYY')}`}
                    </Text>
                </View>
                {icons.plaindark('info', vars.iconSize, infoIconStyle)}
            </TouchableOpacity>);
    }

    titleIOS() {
        const { folder } = this;
        return `${folder.name}\n${folder.sizeFormatted} ${moment(folder.uploadedAt).format('DD/MM/YYYY')}`;
    }

    renderThrow() {
        const { folder } = this;
        if (!folder) return null;
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.onPress}
                title={this.title}
            />
        );
    }
}
