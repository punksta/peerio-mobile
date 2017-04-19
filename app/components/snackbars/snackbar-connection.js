import { observer } from 'mobx-react/native';
import SnackbarBase from './snackbar-base';
import snackbarState from './snackbar-state';
import { socket } from '../../lib/icebear';
import { t } from '../utils/translator';

@observer
export default class SnackbarConnection extends SnackbarBase {
    get isVisible() { return !socket.connected; }

    // to override
    getText() {
        return socket.connected ? null : t('error_connecting');
    }

    // to override
    getShowDelay() {
        return 2000;
    }

    tap() {
        this.hide(() => snackbarState.pop());
    }
}
