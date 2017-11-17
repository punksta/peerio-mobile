import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { gradient } from '../controls/effects';
import { vars } from '../../styles/styles';
import routerApp from '../routes/router-app';
import loginState from '../login/login-state';
import SnackBarConnection from '../snackbars/snackbar-connection';
import { promiseWhen } from '../helpers/sugar';
import { socket } from '../../lib/icebear';
import routerMain from '../routes/router-main';

const tabs = {
    backgroundColor: vars.tabsBg,
    height: vars.tabsHeight
};

@observer
export default class MockLoadingReturn extends Component {
    async componentDidMount() {
        await promiseWhen(() => socket.connected);
        await loginState.load();
        await promiseWhen(() => socket.authenticated);
        await promiseWhen(() => routerMain.chatStateLoaded);
        await promiseWhen(() => routerMain.fileStateLoaded);
        await promiseWhen(() => routerMain.contactStateLoaded);
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
                <View>
                    {gradient({
                        paddingTop: vars.statusBarHeight,
                        height: vars.headerHeight,
                        justifyContent: 'flex-end',
                        backgroundColor: vars.bg
                    })}
                    <SnackBarConnection />
                </View>
                <View style={tabs} />
            </View>
        );
    }
}
