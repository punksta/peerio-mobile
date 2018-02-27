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
export default class FilesActionSheet extends SafeComponent {
    @observable file = null;
    DELETE_INDEX = 3;
    CANCEL_INDEX = 4;

    get items() { return [this.sharefile, this.moveFile, this.renameFile, this.deleteFile, this.cancel]; }

    get cancel() { return { title: tx('button_cancel') }; }

    get moveFile() {
        return {
            title: tx('button_move'),
            action: () => {
                fileState.currentFile = this.file;
                routerModal.moveFileTo();
            }
        };
    }

    get renameFile() {
        if (!this.file) return { title: '', action: null };
        return {
            title: tx('button_rename'),
            action: async () => {
                const newFileName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(this.file.name)
                );
                if (newFileName) {
                    await this.file.rename(`${newFileName}.${this.file.ext}`);
                }
            }
        };
    }

    get sharefile() {
        return {
            title: tx('button_share'),
            action: () => {
                fileState.currentFile = this.file;
                routerModal.shareFileTo();
            }
        };
    }

    get deleteFile() {
        return {
            title: tx('button_delete'),
            action: () => {
                fileState.deleteFile(this.file);
            }
        };
    }

    onPress = index => {
        if (this.items[index]) {
            const { action } = this.items[index];
            action && action();
        }
    };

    show = (file) => {
        this.file = file;
        this._actionSheet.show();
    };

    onFileInfoPress = () => {
        this._actionSheet.hide();
        routerModal.discard();
        routerMain.files(this.file);
    };

    renderThrow() {
        const containerStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'row'
        };
        const titleTextStyle = {
            fontSize: vars.font.size.smaller,
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: vars.spacing.small.mini,
            lineHeight: 18
        };
        let title = null;
        if (this.file) {
            title =
                (<TouchableOpacity style={containerStyle} onPress={this.onFileInfoPress}>
                    <Text style={titleTextStyle}>
                        {`${this.file.name}\n${this.file.sizeFormatted} ${moment(this.file.uploadedAt).format('DD/MM/YYYY')}`}
                    </Text>
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
