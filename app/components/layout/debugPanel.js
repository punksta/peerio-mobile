import React, { Component } from 'react';
import {
    View
} from 'react-native';
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
