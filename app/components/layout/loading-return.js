import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { gradient } from '../controls/effects';
import { vars } from '../../styles/styles';
import routerApp from '../routes/router-app';
import loginState from '../login/login-state';

const tabs = {
    backgroundColor: vars.tabsBg,
    height: vars.tabsHeight
};

@observer
export default class MockLoadingReturn extends Component {
    async componentDidMount() {
        await loginState.load();
        if (!loginState.loaded) routerApp.routes.loginStart.transition();
    }

    render() {
        const s = {
            backgroundColor: 'white',
            flex: 1,
            flexGrow: 1,
            justifyContent: 'space-between'
        };
        return (
            <View style={s}>
                {gradient({
                    paddingTop: vars.statusBarHeight,
                    height: vars.headerHeight,
                    justifyContent: 'flex-end',
                    backgroundColor: vars.bg
                })}
                <View style={tabs} />
            </View>
        );
    }
}
