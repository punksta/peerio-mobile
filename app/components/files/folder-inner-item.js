import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, Dimensions, View } from 'react-native';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
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
    paddingLeft: vars.spacing.small.midi2x
};

const folderInfoContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderColor: 'green'
};

@observer
export default class FolderInnerItem extends SafeComponent {
    onPress() {
        const folder = this.props.folder;
        this.props.onPress ? this.props.onPress(this.props.folder)
            : (folder.selected = !folder.selected);
    }

    checkbox() {
        const checked = this.props.folder && this.props.folder.selected;
        console.log(`checked: ${checked}`);
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
        const folder = this.props.folder;
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
        let icon = 'folder';
        icon = icons.dark(icon);
        const loadingStyle = null;
        const marginLeft = this.props.checkbox === 'always' ? 0 : -checkBoxWidth;
        const arrow = this.props.hideArrow ? null : (
            <View style={{ flex: 0 }}>
                {icons.dark('keyboard-arrow-right', this.onPress)}
            </View>
        );
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={[folderInfoContainerStyle, { marginLeft }]}>
                    {this.checkbox()}
                    <View style={[itemContainerStyle, { width: width - marginLeft - checkBoxWidth }]}>
                        <View style={[loadingStyle, { flex: 0 }]}>
                            {icon}
                        </View>
                        <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: vars.spacing.medium.mini2x }}>
                            <Text style={nameStyle} numberOfLines={1} ellipsizeMode="tail">{folder.name}</Text>
                            <Text style={infoStyle}>
                                {moment(folder.createdAt).format(`MMM Do YYYY, hh:mm a`)}
                            </Text>
                        </View>
                        {arrow}
                    </View>
                </View>
            </View>
        );
    }
}

FolderInnerItem.propTypes = {
    onPress: PropTypes.func,
    folder: PropTypes.any.isRequired,
    checkbox: PropTypes.string,
    hideArrow: PropTypes.bool
};
