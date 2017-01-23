import { observable, action } from 'mobx';
import mainState from '../main/main-state';

const ghostState = observable({
    transition() {
        mainState.resetMenus();
        mainState.route = 'ghosts';
    }
});

export default ghostState;
