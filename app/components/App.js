import React from 'react';
import { View, Text, PanResponder, AppState, ActivityIndicator, NativeModules, Platform, AdSupportIOS } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from './shared/safe-component';
import PopupLayout from './layout/popup-layout';
import ModalLayout from './layout/modal-layout';
import RouteNavigator from './routes/route-navigator';
import routerApp from './routes/router-app';
import uiState from './layout/ui-state';
import { gradient } from './controls/effects';
import { clientApp, crypto } from '../lib/icebear';
import { scryptNative, signDetachedNative, verifyDetachedNative } from '../lib/scrypt-native';
import push from '../lib/push';
import { enableIdfa } from '../lib/idfa';
import '../lib/sounds';
import './utils/bridge';
import socketResetIfDead from './utils/socket-reset';
import MockComponent from './mocks';

@observer
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

        if (console._errorOriginal) {
            console.error = console._errorOriginal;
        }

        global.ErrorUtils && global.ErrorUtils.setGlobalHandler((...args) => {
            console.error(`App.js: unhandled error`);
            console.error(args);
        });

        console.stack = [];
        console.stackPush = (msg) => {
            const MAX = 300;
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

        const warn = console.warn;
        console.warn = function() {
            __DEV__ && warn.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        console.disableYellowBox = true;

        const error = console.error;
        console.error = function() {
            __DEV__ && error.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this._handleMemoryWarning = this._handleMemoryWarning.bind(this);

        push.clearBadge();
        enableIdfa();
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('memoryWarning', this._handleMemoryWarning);
        NativeModules.PrivacySnapshot && NativeModules.PrivacySnapshot.enabled(true);
        if (NativeModules.RNSodium && NativeModules.RNSodium.scrypt) {
            console.log('App.js: using native scrypt');
            crypto.setScrypt(scryptNative);
        }
        console.log('App.js: settings worker sign/verify');
        if (NativeModules.RNSodium) {
            const { signDetached, verifyDetached } = NativeModules.RNSodium;
            if (signDetached && verifyDetached) {
                // console.log('Using native implementation');
                crypto.sign.setImplementation(signDetachedNative, verifyDetachedNative);
            }
        }

        if (!MockComponent) routerApp.routes.loginStart.transition();
    }

    _handleAppStateChange(appState) {
        console.log(`App.js: AppState change: ${appState}`);
        if (uiState.appState === 'background' && appState === 'active') {
            socketResetIfDead();
        }
        uiState.appState = appState;
        if (appState === 'active') {
            push.clearBadge();
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

    _placeHolder() {
        return (
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    renderThrow() {
        if (MockComponent) return <MockComponent />;
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
