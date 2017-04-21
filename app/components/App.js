import React, { Component } from 'react';
import { View, Text, PanResponder, AppState, ActivityIndicator, NativeModules } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from './layout/popup-layout';
import ModalLayout from './layout/modal-layout';
import RouteNavigator from './routes/route-navigator';
import routerApp from './routes/router-app';
import uiState from './layout/ui-state';
import styles, { vars } from './../styles/styles';
import { clientApp, crypto } from '../lib/icebear';
import worker from '../lib/worker';
import { scryptToWorker, signDetachedToWorker, verifyDetachedToWorker } from '../lib/scrypt-worker';
import push from '../lib/push';
import '../lib/sounds';
import './utils/bridge';
import './touchid/touchid-bridge';

@observer
export default class App extends Component {
    constructor(props) {
        super(props);
        uiState.load();

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                uiState.hidePicker();
                return false;
            }
        });

        routerApp.routes.loginStart.transition();

        if (console._errorOriginal) {
            console.error = console._errorOriginal;
        }

        global.ErrorUtils && global.ErrorUtils.setGlobalHandler((...args) => {
            console.error(`App.js: unhandled error`);
            console.error(args);
        });

        console.stack = [];
        console.stackPush = (msg) => {
            const MAX = 1000;
            const index = console.stack.length;
            const delta = index - MAX;
            const time = new Date();
            console.stack.splice(index, delta > 0 ? delta : 0, { msg, time });
        };

        const log = console.log;
        console.log = function() {
            __DEV__ && log.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        const error = console.error;
        console.error = function() {
            __DEV__ && error.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this._handleMemoryWarning = this._handleMemoryWarning.bind(this);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('memoryWarning', this._handleMemoryWarning);
        NativeModules.PrivacySnapshot && NativeModules.PrivacySnapshot.enabled(true);
        worker.init()
        .then(() => {
            console.log('App.js: settings worker scrypt');
            crypto.setScrypt(scryptToWorker);
            console.log('App.js: settings worker sign/verify');
            crypto.sign.setDetachedVerify(signDetachedToWorker, verifyDetachedToWorker);
        });
    }

    _handleAppStateChange(appState) {
        console.log(`App.js: AppState change: ${appState}`);
        uiState.appState = appState;
        if (appState === 'active') {
            push.disableServerSide();
            clientApp.isFocused = true;
        }
        if (appState === 'background') {
            push.enableServerSide();
            clientApp.isFocused = false;
        }
    }

    _handleMemoryWarning() {
        console.log(`App.js: AppState memory warning`);
    }

    render() {
        return !uiState.locale ? (
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        ) : (
            <View
                testID="appOuterViewBackground"
                style={{ flexGrow: 1, backgroundColor: vars.bg }}>
                <RouteNavigator routes={routerApp} />
                <ModalLayout />
                <PopupLayout />
                {uiState.picker}
                <Text style={{ height: 0 }} testID="debugText">{uiState.debugText}</Text>
            </View>
        );
    }
}
