import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import { Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import { vars, helpers } from '../../styles/styles';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';

const height = vars.listItemHeight;

const folderInfoContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height,
    paddingLeft: vars.spacing.medium.mini2x,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)',
    alignItems: 'center'
};

@observer
export default class FolderInnerItem extends SafeComponent {
    @observable width = 0;

    onPress = () => this.props.onPress && this.props.onPress(this.props.folder);

    get currentProgress() {
        const { folder } = this.props;
        const { progress, progressMax } = folder;
        const { width } = this;
        if (!width || !progressMax) return 0;
        return width * progress / progressMax;
    }

    get currentProgressPercent() {
        const { folder } = this.props;
        const { progress, progressMax } = folder;
        if (!progressMax) return 0;
        return progress / progressMax * 100;
    }

    @action.bound layout(evt) {
        this.width = evt.nativeEvent.layout.width;
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
        const { folder, onPress, onSelect, hideMoreOptionsIcon, onFolderActionPress } = this.props;
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
        const loadingStyle = null;
        const optionsIcon = hideMoreOptionsIcon ? null : (
            <View style={{ flex: 0 }}>
                {icons.dark(
                    'more-vert',
                    !isBlocked ? onFolderActionPress : null,
                    !isBlocked ? null : { opacity: 0.38 })}
            </View>);
        return (
            <TouchableOpacity
                onPress={hideMoreOptionsIcon ? onSelect : onPress}
                style={{ backgroundColor: 'white' }}
                disabled={isBlocked}>
                <View style={folderInfoContainerStyle} onLayout={this.layout}>
                    <View style={progressContainer} />
                    {this.radio}
                    <View style={[loadingStyle, { flex: 0 }]}>
                        {icons.darkNoPadding(isShared ? 'folder-shared' : 'folder', null, null, vars.iconSize)}
                    </View>
                    <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: vars.spacing.medium.maxi2x }}>
                        <Text style={nameStyle} numberOfLines={1} ellipsizeMode="tail">{folder.isRoot ? tx('title_files') : folder.name}</Text>
                        {this.fileDetails}
                    </View>
                    {optionsIcon}
                </View>
            </TouchableOpacity>
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
