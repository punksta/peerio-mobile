import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routerModal from '../routes/router-modal';
import routes from '../routes/routes';
import { popupInput } from '../shared/popups';
import { fileHelpers } from '../../lib/icebear';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import routerMain from '../routes/router-main';

@observer
export default class FilesActionSheet extends SafeComponent {
    // TODO add folder sharing when it has been implemented
    get items() {
        const { file } = this.props;
        let result;
        if (file.isFolder) {
            this.DELETE_INDEX = 2;
            this.CANCEL_INDEX = 3;
            result = [this.moveFile, this.renameFile, this.deleteFolder, this.cancel];
        } else {
            this.DELETE_INDEX = 3;
            this.CANCEL_INDEX = 4;
            result = [this.sharefile, this.moveFile, this.renameFile, this.deleteFile, this.cancel];
        }
        return result;
    }

    get cancel() { return { title: tx('button_cancel') }; }

    // File and Folder functions
    get moveFile() {
        const { file } = this.props;
        return {
            title: tx('button_move'),
            action: () => {
                fileState.currentFile = file;
                routerModal.moveFileTo();
            }
        };
    }

    get renameFile() {
        const { file } = this.props;
        return {
            title: tx('button_rename'),
            async action() {
                const newFileName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(file.name)
                );
                if (newFileName) {
                    file.isFolder ?
                        await file.rename(`${newFileName}`) :
                        await file.rename(`${newFileName}.${file.ext}`);
                }
            }
        };
    }

    // File specific functions
    get sharefile() {
        const { file } = this.props;
        return {
            title: tx('button_share'),
            action: () => {
                fileState.currentFile = file;
                routerModal.shareFileTo();
            }
        };
    }

    // Do we need to check if file is ready to be deleted ?
    get deleteFile() {
        const { file } = this.props;
        return {
            title: tx('button_delete'),
            async action() {
                fileState.deleteFile(file);
            }
        };
    }

    // Folder Specific functions
    get deleteFolder() {
        const { file } = this.props;
        return {
            title: tx('button_delete'),
            async action() {
                fileState.store.folders.deleteFolder(file);
            }
        };
    }

    onPress = index => {
        if (this.items[index]) {
            const { action } = this.items[index];
            action && action();
        }
    };

    show = () => this._actionSheet.show();

    // Can be simplified ?
    onFileInfoPress = () => {
        const { file } = this.props;
        this._actionSheet.hide();
        routerModal.discard();
        routerMain.files(file);
    };

    renderThrow() {
        const { file } = this.props;
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
        const folderSizeText = file.size ?
            file.sizeFormatted :
            tx('title_empty');
        const title =
            (<TouchableOpacity style={containerStyle} onPress={this.onFileInfoPress}>
                <View style={containerStyle}>
                    <Text style={[containerStyle, titleTextStyle]}>
                        {`${file.name}\n${file.isFolder ? folderSizeText : file.sizeFormatted} ${moment(file.uploadedAt).format('DD/MM/YYYY')}`}
                    </Text>
                </View>
                {icons.plaindark('info', vars.iconSize, infoIconStyle)}
            </TouchableOpacity>);
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

FilesActionSheet.propTypes = {
    file: PropTypes.any
};
