import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import routerMain from '../routes/router-main';
import styles, { vars } from '../../styles/styles';
import BackIcon from './back-icon';
import DownIcon from './down-icon';

@observer
export default class HeaderMain extends Component {
    render() {
        let leftIcon = null;
        if (routerMain.isBackVisible) {
            leftIcon = <BackIcon />;
        }
        const textStyle = {
            flexGrow: 1,
            flexShrink: 1,
            color: vars.white,
            fontSize: 18,
            fontWeight: 'bold',
            alignItems: 'center',
            maxWidth: 300
            // marginLeft: routerMain.currentIndex === 0 ? vars.iconSize * 3 : -vars.iconSize
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
                <View key={`header_${routerMain.route}_${routerMain.currentIndex}`} style={containerStyle}>
                    {leftIcon}
                    <View style={{ flex: 1, borderWidth: 0, borderColor: 'yellow', flexGrow: 1, flexShrink: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={titleAction}
                            pressRetentionOffset={vars.retentionOffset}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={2}
                                    style={textStyle}>{routerMain.title}</Text>
                                { titleAction && <DownIcon action={titleAction} /> }
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ backgroundColor: 'transparent' }} testID="rightMenuButton">
                        {icons.white('more-vert', () => routerMain.toggleRightMenu())}
                    </View> */}
                </View>
            </View>
        );
    }
}

