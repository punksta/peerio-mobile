import SnackbarBase from './snackbar-base';
import snackbarState from './snackbar-state';

export default class Snackbar extends SnackbarBase {
    level = 'medium';

    // to override
    getText() { return snackbarState.text; }
    isGreen() { return snackbarState.isGreen; }

    tap() {
        this.hide(() => snackbarState.pop());
    }
}
