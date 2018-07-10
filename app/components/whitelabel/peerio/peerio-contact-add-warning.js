import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';

@observer
export default class PeerioContactAddWarning extends SafeComponent {
    renderThrow() {
        return (
            <div />
        );
    }
}
