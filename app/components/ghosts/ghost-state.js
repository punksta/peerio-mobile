import { observable } from 'mobx';
import mainState from '../main/main-state';
import { tx } from '../utils/translator';
import { mailStore, User } from '../../lib/icebear';
import { popupUpgrade } from '../shared/popups';

const ghostState = observable({
    isComposing: false,

    transition() {
        mainState.resetMenus();
        mainState.route = 'ghosts';
        mainState.currentIndex = 0;
    },

    compose() {
        if (!User.current.canSendGhost()) {
            popupUpgrade(tx('ghosts_sendingError'), null, tx('ghosts_quotaExceeded'));
            return;
        }
        ghostState.isComposing = true;
        mainState.currentIndex = 1;
        mainState.isBackVisible = true;
    },

    view(ghost) {
        ghostState.isComposing = false;
        mainState.route = 'ghosts';
        mainState.currentIndex = 1;
        mainState.isBackVisible = true;
        mailStore.selectedId = ghost.ghostId;
    }
});

mainState.titles.ghosts = (/* s */) => {
    return tx('ghosts');
};

mainState.fabActions.ghosts = () => ghostState.compose();

export default ghostState;
