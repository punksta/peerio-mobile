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
export default class FilesActionSheet extends SafeComponent {
    DELETE_INDEX = 3;
    CANCEL_INDEX = 4;

    get items() {
        const { file } = this;
        let result;
        // TODO remove ! after testing
        if (!file.isLegacy) {
            this.DELETE_INDEX = 1;
            this.CANCEL_INDEX = 2;
            result = [this.viewFile, this.deleteFile, this.cancel];
        } else {
            this.DELETE_INDEX = 3;
            this.CANCEL_INDEX = 4;
            result = [this.sharefile, this.moveFile, this.renameFile, this.deleteFile, this.cancel];
        }
        return result;
    }

    get cancel() { return { title: tx('button_cancel') }; }

    get sharefile() {
        return {
            title: tx('button_share'),
            action: () => {
                fileState.currentFile = this.file;
                routerModal.shareFileTo();
            }
        };
    }

    get viewFile() {
        return {
            title: tx('button_viewFile'),
            action: () => { this.onFileInfoPress(); }
        };
    }

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
        return {
            title: tx('button_rename'),
            action: async () => {
                const { file } = this;
                const newFileName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(file.name)
                );
                if (newFileName) await file.rename(`${newFileName}.${file.ext}`);
            }
        };
    }

    get deleteFile() {
        return {
            title: tx('button_delete'),
            action: async () => {
                fileState.deleteFile(this.file);
            }
        };
    }

    onPress = index => {
        if (this.items[index]) {
            const { action: pressAction } = this.items[index];
            pressAction && pressAction();
        }
    };

    @observable file = null;
    @observable _actionSheet = null;

    /**
     * @param {File} file
     */
    @action.bound show(file) {
        if (!file) {
            console.error(`files-action-sheet: file is undefined`);
            return;
        }
        if (this._showWhen) {
            this._showWhen();
            this._showWhen = null;
        }
        // We need to re-render and re-ref action sheet
        // so that the title is updated accordingly
        if (this.file !== file) {
            this._actionSheet = null;
            this.file = file;
        }
        this._showWhen = when(() => this._actionSheet, () => this._actionSheet.show());
    }

    onFileInfoPress = () => {
        const { file } = this;
        this._actionSheet.hide();
        routerModal.discard();
        routerMain.files(file);
    };

    get title() { return Platform.OS === 'android' ? this.titleAndroid() : this.titleIOS(); }

    titleAndroid() {
        const { file } = this;
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
            paddingHorizontal: vars.spacing.huge.mini2x,
            lineHeight: 18
        };
        return (
            <TouchableOpacity style={containerStyle} onPress={this.onFileInfoPress}>
                <View style={{ flex: 1 }}>
                    <Text style={[containerStyle, titleTextStyle]} numberOfLines={1} ellipsizeMode="middle">
                        {file.name}
                    </Text>
                    <Text style={[containerStyle, titleTextStyle]} numberOfLines={1} ellipsizeMode="middle">
                        {file.sizeFormatted} {moment(file.uploadedAt).format('DD/MM/YYYY')}
                    </Text>
                </View>
                {icons.plaindark('info', vars.iconSize, infoIconStyle)}
            </TouchableOpacity>);
    }

    titleIOS() {
        const { file } = this;
        return `${file.name}\n${file.sizeFormatted} ${moment(file.uploadedAt).format('DD/MM/YYYY')}`;
    }

    refActionSheet = ref => { this._actionSheet = ref; };
    mapItem = item => item.title;

    renderThrow() {
        const { file } = this;
        if (!file) return null;
        return (
            <ActionSheet
                key={file.fileId}
                ref={this.refActionSheet}
                options={this.items.map(this.mapItem)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.onPress}
                title={this.title}
            />
        );
    }
}