import React from 'react';
import { View, TextInput, Dimensions } from 'react-native';
import { when, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { config, overrideServer, socket } from '../../lib/icebear';
import loginState from '../login/login-state';
import { wizard, vars } from '../../styles/styles';
import Button from '../controls/button';
import Logs from '../logs/logs';
import consoleOverride from '../../lib/console-override';
import SafeComponent from './safe-component';
import uiState from '../layout/ui-state';

const { height } = Dimensions.get('window');

@observer
export default class DebugMenu extends SafeComponent {
    @observable showDebugLogs = false;
    @observable switchServerValue = '';
    @observable disableButtons = true;

    componentDidMount() {
        when(() => socket.connected, () => { this.switchServerValue = config.socketServerUrl; });
        when(() => uiState.showDebugMenu, () => {
            setTimeout(() => {
                this.disableButtons = false;
            }, 2000);
        });
    }

    async debugServer(serverName) {
        await overrideServer(serverName);
        loginState.restart();
    }

    renderThrow() {
        if (!uiState.showDebugMenu) return null;

        const debugContainer = {
            backgroundColor: vars.darkBlue,
            height: 120,
            marginTop: vars.spacing.small.maxi2x
        };
        const buttonContainer = {
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingHorizontal: vars.loginWizard_debugMenu_paddingH
        };
        const s = [wizard.footer.button.base, {
            padding: vars.spacing.small.mini2x,
            justifyContent: 'center',
            backgroundColor: '#FFFFFF10',
            borderColor: '#FFFFFF50',
            borderWidth: 1,
            borderRadius: 6
        }];
        const input = {
            marginHorizontal: vars.spacing.medium.maxi2x,
            height: 40,
            backgroundColor: '#FFFFFF90',
            marginTop: vars.spacing.small.maxi2x,
            fontFamily: vars.peerioFontFamily
        };
        return (
            <View>
                <View style={debugContainer}>
                    <View style={buttonContainer}>
                        <Button
                            style={s}
                            onPress={() => { this.showDebugLogs = !this.showDebugLogs; }}
                            text="Show logs"
                            disabled={this.disableButtons} />
                        <Button
                            style={s}
                            onPress={() => { consoleOverride.verbose = !consoleOverride.verbose; }}
                            text={consoleOverride.verbose ? 'Verbose On' : 'Verbose Off'}
                            disabled={this.disableButtons} />
                        <Button
                            style={s}
                            onPress={() => this.debugServer(this.switchServerValue)}
                            text="Override server"
                            disabled={this.disableButtons} />
                        <Button
                            style={s}
                            onPress={() => this.debugServer(null)}
                            text="Reset"
                            disabled={this.disableButtons} />
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
                {this.debugLogs}
            </View>
        );
    }

    get debugLogs() {
        return this.showDebugLogs ?
            <View style={{ backgroundColor: 'white', height: height * 0.6 }}>
                <Logs />
            </View> : null;
    }
}
