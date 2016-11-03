import React, { Component } from 'react';
import { View, PanResponder, Navigator } from 'react-native';
import { reaction, action } from 'mobx';
import { observer } from 'mobx-react/native';
import Login from './login/login';
import Signup from './signup/signup';
import PersistentFooter from './layout/persistent-footer';
// import DebugPanel from './layout/debugPanel';
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
        state.load();
        this.renderScene = this.renderScene.bind(this);

        this.routes = [
            this.route('loginClean', Login.Clean, true),
            this.route('loginSaved', Login.Saved),
            this.route('signupStep1', Signup.Step1),
            this.route('signupStep2', Signup.Pin),
            this.route('main', LayoutMain, true)
        ];

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                state.hidePicker();
                return false;
            }
        });

        this.bindRouteState = reaction(() => state.route, route => {
            console.log('reaction: %s => %s', state.prevRoute, route);
            const newIndex = state.routesList.indexOf(route);
            const oldIndex = state.routesList.indexOf(state.prevRoute);
            state.prevRoute = route;
            const rInfo = state.routes[route];
            if (rInfo.replace) {
                this.nav.resetTo(rInfo);
                return;
            }
            if (newIndex === oldIndex - 1) {
                this.nav.pop();
            } else if (newIndex < oldIndex) {
                this.nav.jumpTo(rInfo);
            } else {
                this.nav.push(rInfo);
            }
            requestAnimationFrame(state.hideKeyboard);
        });
    }

    componentWillMount() {
    }

    componentDidMount() {
        // navigating to initial route
        // timeout is needed for router to properly initialize
        // setTimeout(() => {
        //     state.routes.main.transition();
        // }, 1000);
    }

    route(key, component, replace, type) {
        state.routesList.push(key);
        state.routes[key] = {
            index: state.routesList.length - 1,
            replace,
            key,
            type,
            component,
            states: component.states,
            transition: action(() => {
                setTimeout(() => {
                    state.route = key;
                }, 0);
            })
        };
        return state.routes[key];
    }

    renderScene(route) {
        const inner = React.createElement(route.component);
        this.scene = inner;
        return <View key={route.key} style={styles.navigator.card}>{inner}</View>;
    }

    configureScene(route /* , routeStack */) {
        if (route.index < 2) {
            return Navigator.SceneConfigs.FadeAndroid;
        }
        return Navigator.SceneConfigs.PushFromRight;
    }

    render() {
        if (!state.locale) return null;
        return (
            <View
                style={{ flex: 1 }}>
                <View
                    pointerEvents="auto"
                    style={{ flex: 1, borderWidth: 0, borderColor: 'red' }}>
                    <Navigator
                        style={{ backgroundColor: styles.vars.bg }}
                        ref={nav => (this.nav = nav)}
                        initialRoute={this.routes[0]}
                        configureScene={(route, routeStack) => this.configureScene(route, routeStack)}
                        renderScene={this.renderScene} />
                    <PersistentFooter />
                </View>
                <ModalContainer />
                {state.picker}
            </View>
        );
    }
}

