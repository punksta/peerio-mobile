import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import moment from 'moment';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import mainState from '../main/main-state';
import FileProgress from './file-progress';
import FileActions from './file-actions';

const firstRowStyle = {
    flex: 1,
    flexDirection: 'row'
};

const secondRowStyle = {
    flexDirection: 'row',
    marginTop: 16,
    flex: 0
};

const firstColumnStyle = {
    flex: 1,
    paddingTop: vars.iconPadding + 6
};

const hintStyle = {
    color: '#00000060'
};


@observer
export default class FileView extends Component {

    render() {
        const file = mainState.currentFile || {};
        let icon = 'image';
        if (file.downloading) icon = 'file-download';
        if (file.uploading) icon = 'file-upload';
        icon = icons.dark(icon, null, null, vars.iconFileViewSize);
        // icon = file.downloading || file.uploading ?
            // icons.jumpy(icon) : icon;
        return (
            <View
                style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <View style={firstRowStyle}>
                        <View>
                            {icon}
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
                        <FileProgress file={mainState.currentFile} />
                    </View>
                </View>
                <FileActions file={file} />
            </View>
        );
    }
}
