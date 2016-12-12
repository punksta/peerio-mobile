import React, { Component } from 'react';
import {
    Text,
    View,
    Animated,
    TouchableOpacity
} from 'react-native';
import moment from 'moment';
import { autorun } from 'mobx';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import mainState from '../main/main-state';

const firstRowStyle = {
    flex: 1,
    flexDirection: 'row'
};

const secondRowStyle = {
    flexDirection: 'row',
    marginTop: 16,
    flex: 0
};

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#00000020'
};

const firstColumnStyle = {
    flex: 1,
    paddingTop: vars.iconPadding + 6
};

const hintStyle = {
    color: '#00000060'
};

const actionCellStyle = {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10
};

const actionTextStyle = {
    color: '#00000060'
};

@observer
export default class FileView extends Component {
    action(text, icon, onPress) {
        return (
            <TouchableOpacity
                style={actionCellStyle}
                onPress={onPress}
                pointerEvents={onPress ? null : 'none'}>
                <View pointerEvents="none" style={{ alignItems: 'center' }}>
                    {onPress ? icons.dark(icon) : icons.white(icon)}
                    <Text style={actionTextStyle}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    progress() {
        if (!this.animatedProgress) return null;
        const file = mainState.currentFile;
        if (!file || !file.downloading && !file.uploading) return null;

        const pbContainer = {
            height: 4,
            backgroundColor: '#CFCFCF',
            flex: 1
        };
        const pbProgress = {
            height: 4,
            backgroundColor: 'green',
            width: this.animatedProgress
        };

        return (
            <View style={pbContainer}>
                <Animated.View style={pbProgress} />
            </View>
        );
    }

    layout(evt) {
        const { width } = evt.nativeEvent.layout;
        this.animatedProgress = new Animated.Value(0);
        autorun(() => {
            const file = mainState.currentFile;
            if (!file) return;
            if (!file.downloading && !file.uploading) {
                this.animatedProgress.setValue(0);
                return;
            }
            const progress = width * file.progress / (file.size | 1) | 0;
            if (!progress) return;
            const duration = progress === width ? 100 : 3000;
            console.log('file-view.js: ', progress);
            Animated.timing(this.animatedProgress, {
                toValue: progress, duration }).start();
        });
    }

    render() {
        const file = mainState.currentFile || {};
        let icon = 'image';
        if (file.downloading) icon = 'file-download';
        if (file.uploading) icon = 'file-upload';
        return (
            <View
                style={{ flex: 1, justifyContent: 'space-between' }}
                onLayout={evt => this.layout(evt)}>
                <View>
                    <View style={firstRowStyle}>
                        <View>
                            {icons.dark(icon, null, null, vars.iconFileViewSize)}
                        </View>
                        <View style={firstColumnStyle}>
                            <View>
                                <Text>{file.name}</Text>
                            </View>
                            <View style={secondRowStyle}>
                                <View style={{ flex: 1 }}>
                                    <Text style={hintStyle}>File size</Text>
                                    <Text>{file.sizeFormatted}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={hintStyle}>Type</Text>
                                    <Text>{file.ext}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={hintStyle}>Uploaded</Text>
                                    <Text>{moment(file.uploadedAt).format('MMMM Do YYYY, hh:mm a')}</Text>
                                </View>
                            </View>
                            {/*
                            <View style={secondRowStyle}>
                                <View style={{ flex: 1 }}>
                                    <Text style={hintStyle}>Progress</Text>
                                    <Text>{file.progress}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={hintStyle}>Progress buffer</Text>
                                    <Text>{file.progressBuffer}</Text>
                                </View>
                            </View>*/}
                            {/*
                            <View style={secondRowStyle}>
                                <Text>downloaded: {file.downloaded ? 'yes' : 'no'}</Text>
                                <Text>cache exists: {file.cacheExists ? 'yes' : 'no'}</Text>
                            </View>*/}
                        </View>
                    </View>
                    <View style={secondRowStyle}>
                        {this.progress()}
                    </View>
                </View>
                <View style={bottomRowStyle}>
                    {file.cacheExists ?
                        this.action('Open', 'open-in-new', () => file.launchViewer()) :
                        this.action('Download', 'file-download', () => mainState.downloadFile())}
                    {this.action('Share', 'screen-share')}
                    {this.action('Delete', 'delete', () => mainState.deleteFile())}
                    {this.action('More', 'more-horiz')}
                </View>
            </View>
        );
    }
}
