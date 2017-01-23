import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import Pin from './pin';
import Center from '../controls/center';
import Big from '../controls/big';
import Button from './button';
import styles, { vars } from '../../styles/styles';
import { t, tu } from '../utils/translator';
import { User } from '../../lib/icebear';

@observer
export default class PinModal extends Component {
    constructor(props) {
        super(props);
        this.checkPin = this.checkPin.bind(this);
    }

    checkPin(pin) {
        return User.current.validatePasscode(pin);
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
                <Center style={{ flexGrow: 0, flex: 0 }}>
                    <Big style={styles.text.inverse}>{t('passphrase_enterpin')}</Big>
                </Center>
                <Pin
                    onSuccess={this.props.onSuccess}
                    onEnter={this.checkPin}
                    messageEnter={' '} />
                <View style={{ flexGrow: 0, flex: 0, flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Button text={tu('cancel')} onPress={this.props.onCancel} />
                </View>
            </View>
        );
    }
}

PinModal.propTypes = {
    onCancel: React.PropTypes.func.isRequired,
    onSuccess: React.PropTypes.func.isRequired
};
