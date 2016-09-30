import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { reaction, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { a } from 'peerio-icebear';
import Login from './login/login.js';
import LoginClean from './login/login-clean.js';
import LoginSaved from './login/login-saved.js';
import SignupStep1 from './signup/signup-step1.js';
import SignupPin from './signup/signup-pin.js';
import PersistentFooter from './layout/persistent-footer';
import DebugPanel from './layout/debugPanel';
import LayoutMain from './layout/layout-main';
import ModalContainer from './layout/modal-container';
import state from './layout/state';
import styles from './../styles/styles';

@observer
export default class App extends Component {
    constructor(props) {
        super(props);
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
        });
    }

    componentWillMount() {
        console.log(a);
        this.routes = [
            this.route('login', Login),
            this.route('loginClean', LoginClean, true),
            this.route('loginSaved', LoginSaved, true),
            this.route('signupStep1', SignupStep1),
            this.route('signupStep2', SignupPin),
            this.route('main', LayoutMain, true, 'reset')
        ];

        this.panResponder = PanResponder.create({
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
            state.routes.loginClean.transition();
        }, 0);
    }

    route(key, component, replace, type) {
        state.routesList.push(key);
        state.routes[key] = {
            replace,
            type,
            states: component.states,
            transition: action(() => {
                state.route = key;
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
        const debugPanel = true && <DebugPanel />;
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{ flex: 1 }}>
                    <Router style={styles.navigator.router} onNavigate={(params) => console.log(params)}>
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

