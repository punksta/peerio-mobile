import React from 'react';
import {
    AppRegistry
} from 'react-native';
import './shim';
import App from './app/components/App';

global.platform = 'android';

const nicebear = () => (
    <App />
);

AppRegistry.registerComponent('peeriomobile', () => nicebear);
