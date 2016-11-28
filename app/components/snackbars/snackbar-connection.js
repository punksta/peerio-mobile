import { observer } from 'mobx-react/native';
import SnackbarBase from './snackbar-base';
import snackbarState from './snackbar-state';
import { socket } from '../../lib/icebear';

@observer
export default class SnackbarConnection extends SnackbarBase {
    // to override
    getText() {
        return socket.connected ? null : 'Not connected, trying to connect';
    }

    // to override
    getShowDelay() {
        return 2000;
    }

    tap() {
        this.hide(() => snackbarState.pop());
    }
}
