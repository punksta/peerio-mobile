import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';
import styles, { vars } from '../../styles/styles';
import MessageIcon from './message-icon';
import BackIcon from './back-icon';
import DownIcon from './down-icon';

@observer
export default class HeaderMain extends Component {
    render() {
        let leftIcon = routerMain.isLeftHamburgerVisible ? <MessageIcon /> : null;
        if (routerMain.isBackVisible) {
            leftIcon = <BackIcon />;
        }
        const textStyle = {
            flexShrink: 1,
            color: vars.white,
            fontWeight: vars.font.weight.regular,
            fontSize: 16,
            alignItems: 'center',
            marginLeft: routerMain.isLeftHamburgerVisible ? 0 : vars.iconSize
        };
        const containerStyle = {
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            // paddingTop: vars.statusBarHeight,
            height: vars.headerHeight
        };
        const titleAction = routerMain.titleAction;
        return (
            <View style={{
                height: vars.headerSpacing,
                flex: 0,
                justifyContent: 'flex-end',
                backgroundColor: styles.branding.peeriomobile.bg
            }}>
                <View style={containerStyle}>
                    {leftIcon}
                    <View style={{ flexGrow: 1, flexShrink: 1, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={titleAction}
                            pressRetentionOffset={vars.retentionOffset}>
                            <View style={{ flexDirection: 'row', flexGrow: 1, alignItems: 'center' }}>
                                <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={2}
                                    style={textStyle}>{routerMain.title}</Text>
                                <View style={{ flex: 0, flexGrow: 0, flexShrink: 1 }}>
                                    {titleAction && <DownIcon action={titleAction} />}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: 'transparent' }} testID="rightMenuButton">
                        {icons.white('more-vert', () => routerMain.toggleRightMenu())}
                    </View>
                </View>
            </View>
        );
    }
}

