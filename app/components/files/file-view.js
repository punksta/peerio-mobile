import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import FileProgress from './file-progress';
import FileActions from './file-actions';
import { fileState } from '../states';
import { tx } from '../utils/translator';
import FileTypeIcon from './file-type-icon';

const firstRowStyle = {
    flex: 0,
    flexDirection: 'row',
    marginTop: vars.spacing.small.maxi2x,
    paddingRight: vars.spacing.medium.mini2x
};

const secondRowStyle = {
    flexDirection: 'row',
    marginTop: vars.spacing.medium.mini2x,
    flex: 0
};

const firstColumnStyle = {
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: vars.iconPadding
};

const hintStyle = {
    color: 'rgba(0,0,0,.54)'
};

@observer
export default class FileView extends SafeComponent {
    get file() {
        return fileState.currentFile || {};
    }

    get actionsBar() {
        return <FileActions file={this.file} />;
    }

    renderThrow() {
        const { file } = this;
        let icon = null;
        if (file.downloading) icon = 'file-download';
        if (file.uploading) icon = 'file-upload';
        if (icon) icon = icons.plaindark(icon, vars.iconFileViewSize);
        return (
            <View
                style={{
                    flexGrow: 1,
                    justifyContent: 'space-between'
                }}>
                <View>
                    <View style={firstRowStyle}>
                        <View style={{
                            marginLeft: vars.spacing.small.mini2x,
                            marginRight: vars.spacing.small.maxi2x
                        }}>
                            {icon ||
                                <FileTypeIcon
                                    size="large"
                                    type={file.iconType}
                                />}
                        </View>
                        <View style={firstColumnStyle}>
                            <View style={{ flexGrow: 1, flexShrink: 1 }}>
                                <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={1}>{file.name}</Text>
                            </View>
                            <View style={secondRowStyle}>
                                <View style={{ flexGrow: 1 }}>
                                    <Text style={hintStyle}>{tx('title_fileSize')}</Text>
                                    <Text>{file.sizeFormatted} {file.ext}</Text>
                                </View>

                                <View style={{ flexGrow: 1 }}>
                                    <Text style={hintStyle}>{tx('title_uploaded')}</Text>
                                    <Text>{moment(file.uploadedAt).format(`MMM DD, YYYY`)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={secondRowStyle}>
                        <FileProgress file={file} />
                    </View>
                </View>
            </View>
        );
    }
}
