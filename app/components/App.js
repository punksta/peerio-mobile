import React, { Component } from 'react';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux';
import DevNav from './dev/dev-nav.js';
import Login from './login/login.js';
import Signup from './signup/signup.js';
import SetupWizard from './setup-wizard/setup-wizard.js';
import Files from './files/files.js';
import Contacts from './contacts/contacts.js';
import Conversation from './messaging/conversation.js';
import ConversationInfo from './messaging/conversation-info.js';

const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
        console.log('ACTION:', action);
        return defaultReducer(state, action);
    };
};

export class App extends Component {
    render() {
        return (
            <Router>
                <Scene key="root" title="dev-root">
                    <Scene key="dev-nav" component={DevNav} />
                    <Scene key="login" component={Login} />
                    <Scene key="signup" component={Signup} />
                    <Scene key="setup-wizard" component={SetupWizard} />
                    <Scene key="conversation" component={Conversation} />
                    <Scene key="conversation-info" component={ConversationInfo} />
                    <Scene key="files" component={Files} />
                    <Scene key="contacts" component={Contacts} />
                </Scene>
            </Router>
        );
    }
}

