import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity } from 'react-native';
import { action } from 'mobx';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import FileProgress from './file-progress';
import FileActions from './file-actions';
import { fileState } from '../states';
import { T, tx } from '../utils/translator';
import FileTypeIcon from './file-type-icon';
import { fileHelpers } from '../../lib/icebear';

const containerStyle = {
    flexGrow: 1,
    justifyContent: 'space-between',
    marginHorizontal: vars.spacing.small.midi
};

const firstRowStyle = {
    flex: 0,
    flexDirection: 'row',
    marginTop: vars.spacing.small.maxi2x,
    paddingRight: vars.spacing.medium.mini2x
};

const iconTypeStyle = {
    marginLeft: vars.spacing.small.mini2x,
    marginRight: vars.spacing.small.maxi2x
};

const secondRowStyle = {
    marginTop: vars.spacing.medium.mini2x
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
export default class FileDetailView extends SafeComponent {
    get file() {
        return fileState.currentFile || {};
    }

    get actionsBar() {
        return <FileActions file={this.file} />;
    }

    @action.bound fileAction() {
        const { file } = this;
        const enabled = file && file.readyForDownload || fileState.showSelection;
        if (enabled) {
            if (file && !file.isPartialDownload && file.cached) {
                file.launchViewer();
            } else {
                fileState.download(file);
            }
        }
    }

    legacyNotification() {
        const notificationContainer = {
            marginTop: vars.spacing.medium.mini2x,
            marginHorizontal: vars.spacing.small.maxi
        };
        const titleContainer = {
            flexDirection: 'row',
            backgroundColor: vars.legacyFileTitleBg,
            borderRadius: 5,
            marginBottom: vars.spacing.small.midi2x,
            paddingVertical: vars.spacing.small.mini,
            paddingHorizontal: vars.spacing.small.mini2x
        };
        const titleStyle = {
            fontSize: vars.font.size.smallerx,
            color: vars.legacyFileTitle,
            paddingVertical: 1
        };
        const descriptionStyle = {
            fontSize: vars.font.size.normal,
            color: vars.subtleText
        };
        const learnMoreStyle = {
            fontSize: vars.font.size.normal,
            color: vars.peerioBlue,
            fontStyle: 'italic',
            fontWeight: vars.font.weight.semiBold,
            marginTop: vars.spacing.medium.mini2x,
            marginBottom: vars.spacing.small.midi
        };
        return (
            <View style={notificationContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={titleContainer}>
                        <Text style={titleStyle}>{tx('title_pending')}</Text>
                    </View>
                </View>
                <View>
                    <Text style={descriptionStyle}>{tx('title_oldVersionDescription1')}</Text>
                    <Text style={descriptionStyle}>{tx('title_oldVersionDescription2')}</Text>
                </View>
                <Text style={learnMoreStyle}><T k="title_learnMoreLegacyFiles" /></Text>
            </View>);
    }

    renderFileDetailView() {
        const { file } = this;
        let icon = null;
        if (file.downloading) icon = 'file-download';
        if (file.uploading) icon = 'file-upload';
        if (icon) icon = icons.plaindark(icon, vars.iconFileViewSize);
        return (
            <View style={containerStyle}>
                <View>
                    {file.isLegacy && this.legacyNotification()}
                    <View style={firstRowStyle}>
                        <View style={iconTypeStyle}>
                            <TouchableOpacity
                                onPress={this.fileAction}
                                pressRetentionOffset={vars.pressRetentionOffset}>
                                {icon ||
                                <FileTypeIcon
                                    size="large"
                                    type={fileHelpers.getFileIconType(file.ext)}
                                />}
                            </TouchableOpacity>
                        </View>
                        <View style={firstColumnStyle}>
                            <View style={{ flexGrow: 1, flexShrink: 1 }}>
                                <TouchableOpacity
                                    onPress={this.fileAction}
                                    pressRetentionOffset={vars.pressRetentionOffset}>
                                    <Text
                                        ellipsizeMode="tail"
                                        numberOfLines={1}>{file.name}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={secondRowStyle}>
                                <View style={{ flexGrow: 1 }}>
                                    <Text style={hintStyle}>{tx('title_fileSize')}</Text>
                                    <Text>{file.sizeFormatted} {file.ext}</Text>
                                </View>

                                <View style={{ flexGrow: 1 }}>
                                    <Text style={hintStyle}>{tx('title_uploaded')}</Text>
                                    <Text>{moment(file.uploadedAt).format(`MM/DD/YY HH:MM:SS a`)}</Text>
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

    renderFolderDetailView() {
        const { file } = this;
        const folder = file; // for the sake of readability
        return (
            <View style={containerStyle}>
                <View style={firstRowStyle}>
                    <View style={iconTypeStyle}>
                        {icons.darkNoPadding('folder', null, null, vars.iconFileViewSize)}
                    </View>
                    <View style={firstColumnStyle}>
                        <View style={{ flexGrow: 1, flexShrink: 1 }}>
                            <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}>{folder.name}
                            </Text>
                        </View>
                        <View style={secondRowStyle}>
                            <View style={{ flexGrow: 1 }}>
                                <Text style={hintStyle}>{tx('title_folderSize')}</Text>
                                <Text>{folder.sizeFormatted}</Text>
                            </View>
                            <View style={{ flexGrow: 1 }}>
                                {folder.createdAt && <Text style={hintStyle}>{tx('title_created')}</Text>}
                                {folder.createdAt && <Text>{moment(folder.createdAt).format(`MMM DD, YYYY`)}</Text>}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderThrow() {
        const { file } = this;
        return (file.isFolder ?
            this.renderFolderDetailView() :
            this.renderFileDetailView());
    }
}
