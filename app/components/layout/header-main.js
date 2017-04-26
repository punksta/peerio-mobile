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
                    <View style={{ flexGrow: 1, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={titleAction}
                            pressRetentionOffset={vars.retentionOffset}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    style={textStyle}>{routerMain.title}</Text>
                                {titleAction && <DownIcon action={titleAction} />}
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

