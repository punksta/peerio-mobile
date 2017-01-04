import React, { Component } from 'react';
import {
    Text,
    Dimensions,
    View,
    TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import moment from 'moment';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

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
    paddingLeft: 8
};

const fileInfoContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderColor: 'green'
};

@observer
export default class FileInnerItem extends Component {
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
            padding: 4,
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

    render() {
        const file = this.props.file;
        const iconRight = icons.dark('keyboard-arrow-right');
        const nameStyle = {
            color: vars.txtDark,
            fontSize: 14,
            fontWeight: vars.font.weight.bold
        };
        const infoStyle = {
            color: vars.subtleText,
            fontSize: 12,
            fontWeight: vars.font.weight.regular
        };
        let icon = 'image';
        if (file.downloading) icon = 'file-download';
        if (file.uploading) icon = 'file-upload';
        let opacity = 1;
        if (file.uploading /* || !file.readyForDownload */) {
            opacity = 0.5;
        }
        icon = icons.dark(icon);
        let loadingStyle = null;
        // if (file.downloading || file.uploading) {
        //     loadingStyle = {
        //         borderWidth: 2,
        //         borderRadius: 32,
        //         borderColor: 'green'
        //     };
        // }
        const marginLeft = this.props.checkbox === 'always' ? 0 : -checkBoxWidth;
        const arrow = this.props.hideArrow ? null : (
            <View style={{ flex: 0 }}>
                {iconRight}
            </View>
        );
        return (
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => this.onPress()}>
                    <View style={[fileInfoContainerStyle, { opacity, marginLeft }]}>
                        {this.checkbox()}
                        <View style={[itemContainerStyle, { width: width - marginLeft - checkBoxWidth }]} pointerEvents="none">
                            <View style={[loadingStyle, { flex: 0 }]}>
                                {icon}
                            </View>
                            <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: 16 }}>
                                <Text style={nameStyle} numberOfLines={1} ellipsizeMode="tail">{file.name}</Text>
                                <Text style={infoStyle}>
                                    {moment(file.uploadedAt).format('MMM Do YYYY, hh:mm a')}
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
    onPress: React.PropTypes.func,
    file: React.PropTypes.any.isRequired,
    checkbox: React.PropTypes.string,
    hideArrow: React.PropTypes.bool
};
