import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import { fileStore } from '../../lib/icebear';
import icons from '../helpers/icons';
import FileProgress from './file-progress';

@observer
export default class FileInlineProgress extends Component {
    get file() {
        const file = fileStore.files.length ?
            fileStore.files[fileStore.files.length - 1] : null;
        return file;
    }

    render() {
        const rowStyle = {
            flexGrow: 1,
            flexDirection: 'row',
            borderColor: 'yellow',
            borderWidth: 0,
            marginBottom: 8
        };
        const file = this.file;
        if (file === null) return null;
        const exists = file && !file.isPartialDownload && file.cacheExists;
        return (
            <TouchableOpacity onPress={() => (exists ? file.launchViewer() : file.download())}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={rowStyle}>
                        <Text
                            style={{ flex: 1, opacity: 0.7, fontWeight: 'bold' }}
                            ellipsizeMode="tail"
                            numberOfLines={3}>
                            {file.name} ({file.sizeFormatted})
                        </Text>
                        <View style={{ flex: 0 }}>
                            {icons.plaindark(exists ? 'open-in-new' : 'file-download')}
                        </View>
                        {/* <View style={{ flex: 0 }}>
                            {icons.plaindark('more-horiz')}
                        </View> */}
                    </View>
                    <FileProgress file={file} />
                </View>
            </TouchableOpacity>
        );
    }
}

FileProgress.propTypes = {
    file: React.PropTypes.any
};

