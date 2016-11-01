import React, { Component } from 'react';
import {
    View
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
        return (
            <View style={{ height: 56, flex: 0, justifyContent: 'center' }}>
                <View style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: 8,
                    paddingLeft: 8,
                    paddingTop: 10,
                    height: styles.vars.headerHeight }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 6, backgroundColor: 'transparent' }}>
                        {leftIcon}
                        {/*
                        <Text style={{
                            marginLeft: 46,
                            color: styles.vars.highlight,
                            lineHeight: 20 }}>Alice</Text>
                        {icons.white('arrow-drop-down', this.leftMenu)} */}
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                        {icons.white('search', this.search)}
                        {icons.white('more-vert', this.rightMenu)}
                    </View>
                </View>
            </View>
        );
    }
}

