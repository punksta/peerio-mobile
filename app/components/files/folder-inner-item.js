import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import { Text, Dimensions, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import { vars, helpers } from '../../styles/styles';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';
import fileState from './file-state';
import chatState from '../messaging/chat-state';

const { width } = Dimensions.get('window');
const height = vars.listItemHeight;
const checkBoxWidth = height;

const folderInfoContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: 'white'
};

@observer
export default class FolderInnerItem extends SafeComponent {
    @observable progressWidth = 0;

    @action.bound onPress() {
        const { folder, onPress } = this.props;
        onPress && onPress(folder);
    }

    @action.bound onCheckBoxPressed() {
        const { folder } = this.props;
        if (!chatState.currentChat.isChannel) {
            folder.selected = !folder.selected;
        }
    }

    checkbox() {
        if (!fileState.isFileSelectionMode) return null;
        const checked = this.props.folder && this.props.folder.selected;
        const v = vars;
        const disabled = chatState.currentChat.isChannel;
        const iconBgColor = 'transparent';
        let iconColor;
        if (disabled) {
            iconColor = v.checkboxDisabled;
        } else {
            iconColor = checked ? v.checkboxIconActive : v.checkboxIconInactive;
        }
        const icon = checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: 'white',
            paddingHorizontal: vars.spacing.small.mini2x,
            flex: 0,
            width: checkBoxWidth,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: vars.spacing.small.mini2x,
            left: 0,
            zIndex: 1
        };
        return (
            <View style={outer}>
                {icons.colored(icon, this.onCheckBoxPressed, iconColor, iconBgColor)}
            </View>
        );
    }

    get currentProgress() {
        const { folder } = this.props;
        const { progress, progressMax } = folder;
        const { progressWidth } = this;
        if (!progressWidth || !progressMax) return 0;
        return progressWidth * progress / progressMax;
    }

    get currentProgressPercent() {
        const { folder } = this.props;
        const { progress, progressMax } = folder;
        if (!progressMax) return 0;
        return progress / progressMax * 100;
    }

    @action.bound layout(evt) {
        this.progressWidth = evt.nativeEvent.layout.width;
    }

    get radio() {
        if (!this.props.radio) return null;
        const outer = {
            width: vars.listItemHeight,
            height: vars.listItemHeight,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        const s = [helpers.circle(20), {
            backgroundColor: vars.white,
            borderColor: vars.txtMedium,
            borderWidth: 2
        }];
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                pressRetentionOffset={vars.pressRetentionOffset}>
                <View style={outer}>
                    <View style={s} />
                </View>
            </TouchableOpacity>
        );
    }

    get fileDetails() {
        const { folder } = this.props;
        const infoStyle = {
            color: vars.extraSubtleText,
            fontSize: vars.font.size.smaller,
            fontWeight: vars.font.weight.regular,
            fontStyle: 'italic'
        };
        const progressPercent = this.currentProgressPercent;
        if (progressPercent) {
            return (
                <Text style={infoStyle}>
                    <Text>{tx(folder.progressText)}{`(${progressPercent}%)`}</Text>
                </Text>
            );
        } else if (folder.isBlocked) {
            return (
                <Text style={infoStyle}>
                    {tx('title_locked')}
                </Text>
            );
        }
        return (
            <Text style={infoStyle}>
                {folder.size ?
                    <Text>{folder.sizeFormatted}</Text> :
                    <Text>{tx('title_empty')}</Text>}
                &nbsp;&nbsp;
                {folder.createdAt && moment(folder.createdAt).format('DD/MM/YYYY')}
            </Text>);
    }

    renderThrow() {
        const { folder, onSelect, hideMoreOptionsIcon, onFolderActionPress } = this.props;
        const { isShared, isBlocked } = folder;
        const progressContainer = {
            backgroundColor: vars.fileUploadProgressColor,
            width: this.currentProgress,
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
        };
        const nameStyle = {
            color: isBlocked ? vars.extraSubtleText : vars.txtDark,
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.bold
        };
        const itemContainerStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height,
            width,
            paddingLeft: fileState.isFileSelectionMode ? checkBoxWidth : vars.spacing.medium.mini2x,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)',
            alignItems: 'center'
        };
        const loadingStyle = null;
        const optionsIcon = hideMoreOptionsIcon ? null : (
            <View style={{ flex: 0 }}>
                {icons.dark(
                    'more-vert',
                    !isBlocked ? onFolderActionPress : null,
                    !isBlocked ? null : { opacity: 0.38 })}
            </View>);
        return (
            <View style={folderInfoContainerStyle} onLayout={this.layout}>
                {this.checkbox()}
                <TouchableOpacity
                    onPress={hideMoreOptionsIcon ? onSelect : this.onPress}
                    disabled={isBlocked}>
                    <View style={itemContainerStyle}>
                        <View style={progressContainer} />
                        {this.radio}
                        <View style={[loadingStyle, { flex: 0 }]}>
                            {icons.plaindark(isShared ? 'folder-shared' : 'folder', vars.iconSize, null)}
                        </View>
                        <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: vars.spacing.medium.maxi2x }}>
                            <Text style={nameStyle} numberOfLines={1} ellipsizeMode="tail">{folder.isRoot ? tx('title_files') : folder.name}</Text>
                            {this.fileDetails}
                        </View>
                        {optionsIcon}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

FolderInnerItem.propTypes = {
    onPress: PropTypes.func,
    onSelect: PropTypes.func,
    folder: PropTypes.any.isRequired,
    hideMoreOptionsIcon: PropTypes.bool,
    radio: PropTypes.bool,
    onFolderActionPress: PropTypes.func
};
