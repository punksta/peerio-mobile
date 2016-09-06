import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import styles from '../../styles/styles';
import icons from '../helpers/icons';
import state from '../layout/state';

@observer
export default class HeaderMain extends Component {
    constructor(props) {
        super(props);
        this.leftMenu = this.leftMenu.bind(this);
    }
    leftMenu() {
        state.isLeftMenuVisible = true;
    }
    render() {
        return (
            <View style={{ height: 56, flex: 0, justifyContent: 'center' }}>
                <View style={{
                    flex: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: 8,
                    paddingLeft: 8,
                    height: 28 }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 6, backgroundColor: 'transparent' }}>
                        {icons.white('menu', this.leftMenu)}
                        <Text style={{
                            marginLeft: 46,
                            color: styles.vars.highlight,
                            lineHeight: 20 }}>Alice</Text>
                        {icons.white('arrow-drop-down', this.leftMenu)}
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                        {icons.white('search', this.leftMenu)}
                        {icons.white('more-vert', this.leftMenu)}
                    </View>
                </View>
            </View>
        );
    }
}

