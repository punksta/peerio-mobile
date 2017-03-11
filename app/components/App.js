import React, { Component } from 'react';
import { View, PanResponder, AppState } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from './layout/popup-layout';
import RouteNavigator from './routes/route-navigator';
import routerApp from './routes/router-app';
import uiState from './layout/ui-state';
import styles, { vars } from './../styles/styles';
// import icebear from '../lib/icebear';
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
        console.stackPush = (i) => {
            const MAX = 1000;
            const index = console.stack.length;
            const delta = index - MAX;
            console.stack.splice(index, delta > 0 ? delta : 0, i);
        };

        const log = console.log;
        console.log = function() {
            log.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        const error = console.error;
        console.error = function() {
            error.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this._handleMemoryWarning = this._handleMemoryWarning.bind(this);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('memoryWarning', this._handleMemoryWarning);
    }

    _handleAppStateChange(appState) {
        console.log(`App.js: AppState change: ${appState}`);
        uiState.appState = appState;
        if (appState === 'active') {
            push.disableServerSide();
        }
        if (appState === 'background') {
            push.enableServerSide();
        }
    }

    _handleMemoryWarning() {
        console.log(`App.js: AppState memory warning`);
    }

    render() {
        if (!uiState.locale) return null;
        return (
            <View
                testID="appOuterViewBackground"
                style={{ flex: 1, backgroundColor: vars.bg }}>
                <RouteNavigator routes={routerApp} />
                <PopupLayout />
                {uiState.picker}
            </View>
        );
    }
}
