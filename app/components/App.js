import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import { reaction } from 'mobx';
import DevNav from './dev/dev-nav.js';
import Logo from './controls/logo.js';
import Login from './login/login.js';
import SignupStep1 from './signup/signup-step1.js';
import SignupStep2 from './signup/signup-step2.js';
import SetupWizard from './setup-wizard/setup-wizard.js';
import Files from './files/files.js';
import Contacts from './contacts/contacts.js';
import Conversation from './messaging/conversation.js';
import ConversationInfo from './messaging/conversation-info.js';
import ReducerCreate from './utils/reducer.js';
import PersistentFooter from './layout/persistent-footer';
import DebugPanel from './layout/debugPanel';
import state from './layout/state';
import styles from './../styles/styles';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.bindRouteState = reaction(() => state.route, route => {
            console.log('reaction: %s => %s', state.prevRoute, route);
            const newIndex = state.routesList.indexOf(route);
            const oldIndex = state.routesList.indexOf(state.prevRoute);
            state.prevRoute = route;
            if (newIndex < oldIndex) {
                Actions.pop();
            } else {
                Actions[route]();
            }
        });
    }
    componentWillMount() {
        this.routes = [
            this.route('login', Login),
            this.route('signupStep1', SignupStep1),
            this.route('signupStep2', SignupStep2)
        ];
    }
    componentDidMount() {
        // navigating to initial route
        // timeout is needed for router to properly initialize
        setTimeout(() => {
            state.routes.signupStep1.transition();
        }, 0);
    }
    route(key, component) {
        state.routesList.push(key);
        state.routes[key] = {
            states: component.states,
            transition: () => {
                state.route = key;
            }
        };
        return (
            <Scene
                key={key}
                component={component}
                hideNavBar
                getSceneStyle={() => styles.navigator.card} />
        );
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Router style={styles.navigator.router} onNavigate={(params) => console.log(params)}>
                        <Scene key="root" title="dev-root" hideNavBar getSceneStyle={() => styles.navigator.card}>
                            {this.routes}
                        </Scene>
                    </Router>
                    <PersistentFooter />
                </View>
                <DebugPanel />
            </View>
        );
    }
}

