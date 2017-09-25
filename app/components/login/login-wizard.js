import React, { Component } from 'react';
import { View, Dimensions, StatusBar, TextInput, LayoutAnimation } from 'react-native';
import { when, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { config, overrideServer, socket } from '../../lib/icebear';
import { tu } from '../utils/translator';
import Wizard from '../wizard/wizard';
import loginState from './login-state';
import { wizard } from '../../styles/styles';
import Logo from '../controls/logo';
import Layout1 from '../layout/layout1';
import Button from '../controls/button';
import LoginAutomatic from './login-automatic';
import LoginStart from './login-start';
import LoginClean from './login-clean';
import LoginPassword from './login-password';
import Logs from '../logs/logs';
import uiState from '../layout/ui-state';
import consoleOverride from '../../lib/console-override';

const { height } = Dimensions.get('window');
const logoHeight = height * 0.33;

@observer
export default class LoginWizard extends Wizard {
    pages = ['loginStart', 'loginClean'];

    get index() { return loginState.current; }
    set index(i) { loginState.current = i; }

    loginStart() {
        return <LoginStart login={() => this.changeIndex(1)} />;
    }

    loginClean() {
        const submit = () => uiState.hideAll().then(() => loginState.login()).catch(e => console.log(e));
        return <LoginClean submit={submit} />;
    }

    componentDidMount() {
        const load = __DEV__ && process.env.PEERIO_SKIPLOGINLOAD ? Promise.resolve(true) : loginState.load();
        load.then(() => {
            if (__DEV__) {
                when(() => loginState.isConnected, () => {
                    loginState.username = process.env.PEERIO_USERNAME || loginState.username;
                    loginState.passphrase = process.env.PEERIO_PASSPHRASE || loginState.passphrase;
                    process.env.PEERIO_AUTOLOGIN && loginState.login();
                });
            }
        });
        when(() => socket.connected, () => { this.switchServerValue = config.socketServerUrl; });
    }

    _counter = 0;
    @observable showDebugMenu = false;
    @observable showDebugLogs = false;
    @observable delayDebugMenu = true;
    @observable switchServerValue = '';

    debugTap() {
        this.showDebugMenu = ++this._counter > 9;
        if (this.showDebugMenu) LayoutAnimation.easeInEaseOut();
    }

    async debugServer(serverName) {
        await overrideServer(serverName);
        loginState.restart();
    }

    get debugMenu() {
        if (this.delayDebugMenu) {
            setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this.delayDebugMenu = false;
            }, 2000);
            return null;
        }
        const s = [wizard.footer.button.base, {
            padding: 4,
            justifyContent: 'center',
            backgroundColor: '#FFFFFF10',
            borderColor: '#FFFFFF50',
            borderWidth: 1,
            borderRadius: 6
        }];
        const input = {
            marginHorizontal: 24,
            height: 24,
            backgroundColor: '#FFFFFF90',
            marginTop: 12
        };
        return (
            <View>
                <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24 }}>
                    <Button style={s} onPress={() => { this.showDebugLogs = !this.showDebugLogs; }} text="Show logs" />
                    <Button style={s}
                        onPress={() => { consoleOverride.verbose = !consoleOverride.verbose; }}
                        text={consoleOverride.verbose ? 'Verbose On' : 'Verbose Off'} />
                    <Button style={s} onPress={() => this.debugServer(this.switchServerValue)} text="Override server" />
                    <Button style={s} onPress={() => this.debugServer(null)} text="Reset" />
                </View>
                <View style={{ flex: 0 }}>
                    <TextInput
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={this.switchServerValue}
                        onChangeText={text => { this.switchServerValue = text; }}
                        style={input} />
                </View>
            </View>
        );
    }

    get debugLogs() {
        return (
            <View style={{ backgroundColor: 'white', flex: 0, height: height * 0.5 }}><Logs /></View>
        );
    }

    render() {
        const style = wizard;
        const body = (
            <View
                style={[style.containerFlex]}>
                {this.showDebugLogs ? this.debugLogs : this.wizard()}
                <StatusBar barStyle="light-content" />
            </View>
        );
        return <Layout1 noScroll={this.index === 0} body={body} />;
    }
}
