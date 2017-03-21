import React from 'react';
import {
    AppRegistry, UIManager
} from 'react-native';
import './shim';
import App from './app/components/App';

global.platform = 'android';

const nicebear = () => (
    <App />
);

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent('peeriomobile', () => nicebear);
