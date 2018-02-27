import React from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity } from 'react-native';
import { observable } from 'mobx';
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
    @observable folder = null;
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
        if (!this.folder) return { title: '', action: null };
        return {
            title: tx('button_rename'),
            action: async () => {
                const newFolderName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(this.folder.name)
                );
                if (newFolderName) {
                    await this.folder.rename(`${newFolderName}`);
                }
            }
        };
    }

    get deleteFolder() {
        return {
            title: tx('button_delete'),
            action: () => {
                fileState.store.folders.deleteFolder(this.folder);
            }
        };
    }

    onPress = index => {
        if (this.items[index]) {
            const { action } = this.items[index];
            action && action();
        }
    };

    show = (folder) => {
        this.folder = folder;
        this._actionSheet.show();
    };

    onFolderInfoPress = () => {
        this._actionSheet.hide();
        routerModal.discard();
        routerMain.files(this.folder);
    };

    renderThrow() {
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
        let title = null;
        if (this.folder) {
            const folderSizeText = this.folder.size ?
                this.folder.sizeFormatted :
                tx('title_empty');
            title =
                (<TouchableOpacity style={containerStyle} onPress={this.onFolderInfoPress}>
                    <View style={containerStyle}>
                        <Text style={[containerStyle, titleTextStyle]}>
                            {`${this.folder.name}\n${folderSizeText} ${moment(this.folder.uploadedAt).format('DD/MM/YYYY')}`}
                        </Text>
                    </View>
                    {icons.plaindark('info', vars.iconSize, infoIconStyle)}
                </TouchableOpacity>);
        }
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.onPress}
                title={title}
            />
        );
    }
}
