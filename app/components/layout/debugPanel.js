import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import styles from '../../styles/styles';
import DevNav from '../dev/dev-nav';

export default class DebugPanel extends Component {
    render() {
        const debugPanelStyle = {
            backgroundColor: '#ffffff30',
            borderColor: 'white'
        };
        return (
            <View style={debugPanelStyle}>
                <DevNav />
            </View>
        );
    }
}
