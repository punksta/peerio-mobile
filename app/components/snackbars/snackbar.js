import { observer } from 'mobx-react/native';
import SnackbarBase from './snackbar-base';
import snackbarState from './snackbar-state';

@observer
export default class Snackbar extends SnackbarBase {
    // to override
    get autoDismiss() { return true; }

    // to override
    getText() {
        return snackbarState.text;
    }

    tap() {
        this.hide(() => snackbarState.pop());
    }
}
