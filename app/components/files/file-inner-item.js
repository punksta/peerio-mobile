import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, Dimensions, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import fileState from './file-state';
import FileSignatureError from './file-signature-error';
import FileTypeIcon from './file-type-icon';

const width = Dimensions.get('window').width;
const height = 64;
const checkBoxWidth = height;
const itemContainerStyle = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)',
    backgroundColor: 'white',
    height,
    width,
    borderWidth: 0,
    borderColor: 'red',
    paddingLeft: vars.spacing.small.midi2x
};

const fileInfoContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderColor: 'green'
};

@observer
export default class FileInnerItem extends SafeComponent {
    onPress() {
        const file = this.props.file;
        this.props.onPress ? this.props.onPress(this.props.file)
            : (file.selected = !file.selected);
    }

    checkbox() {
        const checked = this.props.file && this.props.file.selected;
        const v = vars;
        const color = checked ? v.checkboxActive : v.checkboxInactive;
        const iconColor = checked ? 'white' : v.checkboxIconInactive;
        const iconBgColor = 'transparent';
        const icon = checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: color,
            padding: vars.spacing.small.mini2x,
            flex: 0,
            width: checkBoxWidth,
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    renderThrow() {
        const file = this.props.file;
        if (file.signatureError) return <View style={{ marginHorizontal: vars.spacing.small.midi }}><FileSignatureError /></View>;
        const action = () => !file.uploading && this.onPress();
        const iconRight = file.uploading ? icons.dark('close', () => fileState.cancelUpload(file)) :
            icons.dark('keyboard-arrow-right', action);
        const nameStyle = {
            color: vars.txtDark,
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.bold
        };
        const infoStyle = {
            color: vars.subtleText,
            fontSize: vars.font.size.smaller,
            fontWeight: vars.font.weight.regular
        };
        let icon = null;
        if (file.downloading) icon = 'file-download';
        if (file.uploading) icon = 'file-upload';
        let opacity = 1;
        if (file.uploading /* || !file.readyForDownload */) {
            opacity = 0.5;
        }
        if (icon) icon = icons.dark(icon);
        const loadingStyle = null;
        const marginLeft = this.props.checkbox === 'always' ? 0 : -checkBoxWidth;
        const arrow = this.props.hideArrow ? null : (
            <View style={{ flex: 0 }}>
                {iconRight}
            </View>
        );
        return (
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity onPress={action}>
                    <View style={[fileInfoContainerStyle, { opacity, marginLeft }]}>
                        {this.checkbox()}
                        <View style={[itemContainerStyle, { width: width - marginLeft - checkBoxWidth }]}>
                            <View style={[loadingStyle, { flex: 0 }]}>
                                {icon ||
                                <FileTypeIcon
                                    size='small'
                                    type='txt'
                                />}
                            </View>
                            <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: vars.spacing.medium.mini2x }}>
                                <Text style={nameStyle} numberOfLines={1} ellipsizeMode="tail">{file.name}</Text>
                                <Text style={infoStyle}>
                                    {moment(file.uploadedAt).format(`MMM Do YYYY, hh:mm a`)}
                                </Text>
                            </View>
                            {arrow}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

FileInnerItem.propTypes = {
    onPress: PropTypes.func,
    file: PropTypes.any.isRequired,
    checkbox: PropTypes.string,
    hideArrow: PropTypes.bool
};
