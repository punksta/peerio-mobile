import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import mainState from '../main/main-state';
import styles from '../../styles/styles';

@observer
export default class HeaderMain extends Component {
    constructor(props) {
        super(props);
        this.leftMenu = this.leftMenu.bind(this);
        this.rightMenu = this.rightMenu.bind(this);
    }

    leftMenu() {
        mainState.toggleLeftMenu();
    }

    rightMenu() {
        mainState.toggleRightMenu();
    }

    search() {
    }

    back() {
        mainState.back();
    }

    render() {
        const leftIcon = mainState.isBackVisible ?
            icons.white('keyboard-arrow-left', this.back) :
            icons.white('menu', this.leftMenu);
        const textStyle = {
            color: styles.vars.white,
            fontWeight: styles.vars.font.weight.regular,
            flex: 1,
            fontSize: 16,
            alignItems: 'center',
            marginLeft: 20
        };
        const containerStyle = {
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: styles.vars.statusBarHeight,
            height: styles.vars.headerHeight
        };
        return (
            <View style={{
                height: styles.vars.headerSpacing,
                flex: 0,
                justifyContent: 'flex-end',
                backgroundColor: styles.branding.peeriomobile.bg
            }}>
                <View style={containerStyle}>
                    <View style={{ paddingLeft: 6, backgroundColor: 'transparent' }}>
                        {leftIcon}
                    </View>
                    <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={textStyle}>{this.props.title}</Text>
                    <View style={{ backgroundColor: 'transparent' }}>
                        {icons.white('more-vert', this.rightMenu)}
                    </View>
                </View>
            </View>
        );
    }
}

HeaderMain.propTypes = {
    title: React.PropTypes.string
};
