import React, { Component } from 'react';
import {
    View, ActivityIndicator
} from 'react-native';
import { observer } from 'mobx-react/native';

const overlay = {
    backgroundColor: '#00000020',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};

@observer
export default class ProgressOverlay extends Component {
    render() {
        if (!this.props.enabled) return null;
        return (
            <View style={overlay}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

ProgressOverlay.propTypes = {
    enabled: React.PropTypes.bool
};
