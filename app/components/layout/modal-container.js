import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { observer } from 'mobx-react/native';
import state from './state';

@observer
export default class ModalContainer extends Component {
    render() {
        const container = state.modals && state.modals.length ?
            <View
                testID="modalContainer"
                style={{
                    flex: 1,
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0 }}>{state.modals[state.modals.length - 1]}</View> : null;
        return container;
    }
}

