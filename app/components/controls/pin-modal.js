import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import Pin from './pin';
import Button from './button';
import styles, { vars } from '../../styles/styles';
import uiState from '../layout/ui-state';
import BgPattern from '../controls/bg-pattern';

@observer
export default class PinModal extends Component {
    skipText = `SKIP`;
    initialText = `INITIAL`;

    onSuccess(result) {
        uiState.routerModal.discard(result);
    }

    hide() {
        uiState.routerModal.discard();
    }

    render() {
        const container = {
            flexGrow: 1,
            flex: 1,
            padding: 50,
            backgroundColor: vars.bg
        };
        return (
            <View style={container}>
                <BgPattern />
                <Pin
                    preventSimplePin={this.preventSimplePin}
                    ref={pin => (this.pin = pin)}
                    onConfirm={this.onConfirm}
                    onSuccess={r => this.onSuccess(r)}
                    onEnter={this.onEnter}
                    messageInitial={this.initialText}
                    messageEnter={' '} />
                <View style={{ flexGrow: 0, flex: 0, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Button testID="pin-skip" text={this.skipText} onPress={() => this.hide()} />
                </View>
            </View>
        );
    }
}
