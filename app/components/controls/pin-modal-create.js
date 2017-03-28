import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import Pin from './pin';
import Button from './button';
import styles, { vars } from '../../styles/styles';
import { t, tu } from '../utils/translator';
import { User } from '../../lib/icebear';
import routerModal from '../routes/router-modal';
import BgPattern from '../controls/bg-pattern';
import Center from '../controls/center';
import Big from '../controls/big';
import Bold from '../controls/bold';

@observer
export default class PinModalCreate extends Component {
    success(pin) {
        console.log('pin-modal-create.js: success');
        return User.current.setPasscode(pin).catch(() => {}).finally(() => this.hide());
    }

    hide() {
        routerModal.discard();
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
                    preventSimplePin
                    onConfirm={pin => this.success(pin)}
                    messageInitial={'Create a device PIN'}
                    messageEnter={' '} />
                <View style={{ flexGrow: 0, flex: 0, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Button testID="pin-cancel" text={tu('cancel')} onPress={() => this.hide()} />
                </View>
                <StatusBar barStyle="light-content" />
            </View>
        );
    }
}
