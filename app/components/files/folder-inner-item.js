import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

const height = vars.listItemHeight;
const itemContainerStyle = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height,
    borderWidth: 0,
    borderColor: 'red',
    paddingLeft: vars.spacing.small.midi2x
};

const folderInfoContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row'
};

@observer
export default class FolderInnerItem extends SafeComponent {
    onPress = () => this.props.onPress && this.props.onPress(this.props.folder);

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
        const arrow = this.props.hideArrow ? null : (
            <View style={{ flex: 0 }}>
                {icons.dark('keyboard-arrow-right', this.onPress)}
            </View>
        );
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={folderInfoContainerStyle}>
                    <View style={itemContainerStyle}>
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
    hideArrow: PropTypes.bool
};
