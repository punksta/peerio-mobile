import React from 'react';
import {
    AppRegistry
} from 'react-native';
import './shim';
import App from './app/components/App';

global.platform = 'ios';
global.DOMPurify = require('dompurify')

const nicebear = () => (
    <App />
);

AppRegistry.registerComponent('peeriomobile', () => nicebear);
