import React from 'react';
import { observer } from 'mobx-react/native';
import { t, tu } from '../utils/translator';
import { User } from '../../lib/icebear';
import PinModal from './pin-modal';

@observer
export default class PinModalCreate extends PinModal {
    skipText = tu('button_skip');
    initialText = 'Create a device PIN';
    preventSimplePin = true;
    onConfirm = (pin) => {
        console.log('pin-modal-create.js: success');
        this.pin.spinner(true);
        const user = User.current;
        setTimeout(() => user.setPasscode(pin)
            .then(() => (user.hasPasscodeCached = true))
            .catch(() => {}).finally(() => this.hide()), 200);
    }
}
