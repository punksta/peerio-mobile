import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { reaction, action } from 'mobx';
import { observer } from 'mobx-react/native';
import Login from './login/login';
import Signup from './signup/signup';
import PersistentFooter from './layout/persistent-footer';
import DebugPanel from './layout/debugPanel';
import LayoutMain from './layout/layout-main';
import ModalContainer from './layout/modal-container';
import state from './layout/state';
import styles from './../styles/styles';
import '../lib/icebear';
import './utils/bridge';
import './touchid/touchid-bridge';

@observer
export default class App extends Component {
    constructor(props) {
        super(props);
        state.setLocale('fr');
        reaction(() => state.locale, () => {
            console.log('force update locale');
            Actions.refresh();
        });
        this.bindRouteState = reaction(() => state.route, route => {
            console.log('reaction: %s => %s', state.prevRoute, route);
            const newIndex = state.routesList.indexOf(route);
            const oldIndex = state.routesList.indexOf(state.prevRoute);
            state.prevRoute = route;
            const rInfo = state.routes[route];
            if ((newIndex === oldIndex - 1) && !rInfo.replace) {
                Actions.pop();
            } else {
                Actions[route]();
            }
            requestAnimationFrame(state.hideKeyboard);
        });
    }

    componentWillMount() {
        this.routes = [
            this.route('login', Login.Start),
            this.route('loginClean', Login.Clean, true),
            this.route('loginSaved', Login.Saved, true, 'reset'),
            this.route('signupStep1', Signup.Step1),
            this.route('signupStep2', Signup.Pin),
            this.route('main', LayoutMain, true, 'reset')
        ];

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                state.hidePicker();
                return false;
            }
        });
    }

    componentDidMount() {
        // navigating to initial route
        // timeout is needed for router to properly initialize
        setTimeout(() => {
            state.routes.main.transition();
        }, 0);
    }

    route(key, component, replace, type) {
        state.routesList.push(key);
        state.routes[key] = {
            replace,
            type,
            states: component.states,
            transition: action(() => {
                setTimeout(() => {
                    state.route = key;
                }, 0);
            })
        };
        return (
            <Scene
                type={type}
                key={key}
                component={component}
                hideNavBar
                getSceneStyle={() => styles.navigator.card} />
        );
    }

    render() {
        const debugPanel = false && (typeof __DEV__ !== 'undefined') && <DebugPanel />;
        return (
            <View
                style={{ flex: 1 }}>
                <View
                    pointerEvents="auto"
                    {...this._panResponder.panHandlers}
                    style={{ flex: 1, borderWidth: 0, borderColor: 'red' }}>
                    <Router style={styles.navigator.router} onNavigate={params => console.log(params)}>
                        <Scene key="root" title="dev-root" hideNavBar getSceneStyle={() => styles.navigator.card}>
                            {this.routes}
                        </Scene>
                    </Router>
                    <PersistentFooter />
                </View>
                <ModalContainer />
                {state.picker}
                {debugPanel}
            </View>
        );
    }
}

