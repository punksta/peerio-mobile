import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import { gradient } from '../controls/effects';
import routerMain from '../routes/router-main';
import { vars } from '../../styles/styles';
import BackIcon from './back-icon';

@observer
export default class HeaderMain extends Component {
    render() {
        let leftIcon = null;
        if (routerMain.isBackVisible) {
            leftIcon = <BackIcon />;
        }
        const textStyle = {
            flex: 1,
            flexGrow: 1,
            flexShrink: 1,
            color: vars.white,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'blue',
            borderWidth: 0,
            backgroundColor: 'transparent'
            // marginLeft: routerMain.currentIndex === 0 ? vars.iconSize * 3 : -vars.iconSize
        };
        const containerStyle = {
            flex: -1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: vars.statusBarHeight,
            minHeight: vars.headerHeight
        };
        const titleAction = routerMain.titleAction;
        return gradient({
            paddingTop: vars.statusBarHeight,
            height: vars.headerHeight,
            flex: -1,
            justifyContent: 'flex-end',
            backgroundColor: vars.bg
        },
            <TouchableOpacity onPress={titleAction}
                pressRetentionOffset={vars.retentionOffset}>
                <View key={`header_${routerMain.route}_${routerMain.currentIndex}`} style={containerStyle}>
                    <View style={{ flex: 0 }}>
                        {leftIcon}
                    </View>
                    <Text
                        ellipsizeMode="middle"
                        numberOfLines={1}
                        style={textStyle}>
                        {routerMain.title}
                        {titleAction && <Text style={{ fontSize: 14 }}>
                            {'  ▼  '}
                        </Text>}
                    </Text>
                    {leftIcon && <View style={{ flex: 0, width: vars.iconLayoutSize }} />}
                </View>
            </TouchableOpacity>
        );
    }
}

