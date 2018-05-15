import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import fileState from '../files/file-state';
import icons from '../helpers/icons';
import FileInlineContainer from './file-inline-container';
import FileSignatureError from './file-signature-error';

@observer
export default class FileInlineProgress extends SafeComponent {
    filePreviouslyDownloaded = this.fileExists;

    get file() {
        return fileState.store.getById(this.props.file);
    }

    get fileExists() {
        return !!this.file && !this.file.isPartialDownload && this.file.cached;
    }

    get downloadProgress() {
        if (!this.file) return 0;
        const { progress, progressMax } = this.file;
        return Math.min(Math.ceil(progress / progressMax * 100), 100);
    }

    @action.bound onOpen() {
        if (this.fileExists && !this.file.downloading) {
            this.file.launchViewer();
        } else {
            fileState.download(this.file);
        }
    }

    @action.bound onCancel() {
        fileState.cancelDownload(this.file);
    }

    renderThrow() {
        const file = this.props.chatId ?
            fileState.store.getByIdInChat(this.props.file, this.props.chatId) :
            fileState.store.getById(this.props.file);
        if (!file) return <Text>{`no file ${this.props.file}`}</Text>;
        if (file.signatureError) return <FileSignatureError />;
        return (
            <FileInlineContainer
                file={file}
                onAction={this.props.onAction}
                onLegacyFileAction={this.props.onLegacyFileAction}>
                <View style={{ flex: 0 }}>
                    {!file.uploading && this.props.transparentOnFinishUpload && <ActivityIndicator />}
                    {file.uploading && icons.darkNoPadding('close', () => fileState.cancelUpload(file))}
                </View>
            </FileInlineContainer>
        );
    }
}

FileInlineProgress.propTypes = {
    file: PropTypes.any,
    transparentOnFinishUpload: PropTypes.bool,
    onAction: PropTypes.any
};
