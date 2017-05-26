import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import fileState from '../files/file-state';
import icons from '../helpers/icons';
import FileProgress from './file-progress';

@observer
export default class FileInlineProgress extends SafeComponent {
    renderThrow() {
        const rowStyle = {
            flexGrow: 1,
            flexShrink: 1,
            flexDirection: 'row',
            borderColor: 'yellow',
            borderWidth: 0,
            marginBottom: 8
        };
        const file = fileState.store.getById(this.props.file);
        if (file === null) return null;
        const exists = file && !file.isPartialDownload && file.cached;
        return (
            <TouchableOpacity onPress={() => (exists ? file.launchViewer() : fileState.download(file))}>
                <View>
                    <View style={rowStyle}>
                        <Text
                            style={{ flexGrow: 1, flexShrink: 1, opacity: 0.7, fontWeight: 'bold' }}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {file.name} ({file.sizeFormatted})
                        </Text>
                        <View style={{ flex: 0 }}>
                            {!file.uploading && this.props.transparentOnFinishUpload && <ActivityIndicator />}
                            {!file.uploading && !this.props.transparentOnFinishUpload && icons.plaindark(exists ? 'open-in-new' : 'file-download')}
                            {file.uploading && icons.darkNoPadding('close', () => fileState.cancelUpload(file))}
                        </View>
                    </View>
                    <FileProgress file={file} />
                </View>
            </TouchableOpacity>
        );
    }
}

FileInlineProgress.propTypes = {
    file: React.PropTypes.string,
    transparentOnFinishUpload: React.PropTypes.bool
};

