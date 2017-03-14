import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import Pin from './pin';
import Button from './button';
import styles, { vars } from '../../styles/styles';
import { t, tu } from '../utils/translator';
import { User } from '../../lib/icebear';
import routerModal from '../routes/router-modal';
import BgPattern from '../controls/bg-pattern';

@observer
export default class PinModalCreate extends Component {
    success(pin) {
        console.log('pin-modal-create.js: success');
        const handler = this.props.onSuccess || Promise.resolve();
        return handler(pin).catch(() => {}).finally(() => this.hide());
    }

    hide() {
        routerModal.modalControl = null;
    }

    render() {
        const container = {
            flexGrow: 1,
            flex: 1,
            backgroundColor: vars.bg,
            paddingVertical: vars.modalPaddingVertical,
            paddingHorizontal: vars.modalPaddingHorizontal
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
                    <Button text={tu('cancel')} onPress={() => this.hide()} />
                </View>
            </View>
        );
    }
}

PinModalCreate.propTypes = {
    onSuccess: React.PropTypes.func.isRequired
};
