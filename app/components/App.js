import React from 'react';
import { View, Text, PanResponder, AppState, ActivityIndicator, NativeModules, Platform } from 'react-native';
import SafeComponent from './shared/safe-component';
import PopupLayout from './layout/popup-layout';
import ModalLayout from './layout/modal-layout';
import RouteNavigator from './routes/route-navigator';
import routerApp from './routes/router-app';
import uiState from './layout/ui-state';
import { gradient } from './controls/effects';
import { clientApp, crypto } from '../lib/icebear';
import worker from '../lib/worker';
import { scryptToWorker, signDetachedToWorker, verifyDetachedToWorker } from '../lib/scrypt-worker';
import { scryptNative } from '../lib/scrypt-native';
import push from '../lib/push';
import '../lib/sounds';
import './utils/bridge';
import socketResetIfDead from './utils/socket-reset';

export default class App extends SafeComponent {
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
            const MAX = 100;
            const STEP = 50;
            const index = console.stack.length;
            const delta = index - MAX;
            const time = new Date();
            console.stack.push({ msg, time });
            if (delta > STEP) console.stack.splice(0, delta);
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


        console.log(`App.js: ${Platform.OS} ${Platform.Version}`);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('memoryWarning', this._handleMemoryWarning);
        NativeModules.PrivacySnapshot && NativeModules.PrivacySnapshot.enabled(true);
        worker.init()
            .then(() => {
                console.log('App.js: settings worker scrypt');
                crypto.setScrypt(scryptToWorker);
                if (NativeModules.RNSodium && NativeModules.RNSodium.scrypt) {
                    console.log('App.js: using native scrypt');
                    crypto.setScrypt(scryptNative);
                }
                console.log('App.js: settings worker sign/verify');
                crypto.sign.setImplementation(signDetachedToWorker, verifyDetachedToWorker);
            });
    }

    _handleAppStateChange(appState) {
        console.log(`App.js: AppState change: ${appState}`);
        uiState.appState = appState;
        if (appState === 'active') {
            push.disableServerSide();
            clientApp.isFocused = true;
            socketResetIfDead();
        }
        if (appState === 'background') {
            push.enableServerSide();
            clientApp.isFocused = false;
        }
    }

    _handleMemoryWarning() {
        console.log(`App.js: AppState memory warning`);
    }

    _placeHolder() {
        return (
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    renderThrow() {
        if (!uiState.locale) return this._placeHolder();
        return gradient({
            testID: 'appOuterViewBackground',
            style: { flexGrow: 1 }
        }, [
            <RouteNavigator key="navigator" routes={routerApp} />,
            <ModalLayout key="modals" />,
            <PopupLayout key="popups" />,
            uiState.picker,
            <Text key="debug" style={{ height: 0 }} testID="debugText">{uiState.debugText}</Text>
        ]);
    }
}
