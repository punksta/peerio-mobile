import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import routerMain from '../routes/router-main';
import styles, { vars } from '../../styles/styles';
import MessageIcon from './message-icon';
import BackIcon from './back-icon';

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
            flex: 1,
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
        return (
            <View style={{
                height: vars.headerSpacing,
                flex: 0,
                justifyContent: 'flex-end',
                backgroundColor: styles.branding.peeriomobile.bg
            }}>
                <View style={containerStyle}>
                    {leftIcon}
                    <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={textStyle}>{this.props.title}</Text>
                    <View style={{ backgroundColor: 'transparent' }} testID="rightMenuButton">
                        {icons.white('more-vert', () => routerMain.toggleRightMenu())}
                    </View>
                </View>
            </View>
        );
    }
}

HeaderMain.propTypes = {
    title: React.PropTypes.string
};
