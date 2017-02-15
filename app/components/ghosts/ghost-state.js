import { observable } from 'mobx';
import mainState from '../main/main-state';
import { tx } from '../utils/translator';
import { mailStore } from '../../lib/icebear';

const ghostState = observable({
    isComposing: false,

    transition() {
        mainState.resetMenus();
        mainState.route = 'ghosts';
        mainState.currentIndex = 0;
    },

    compose() {
        ghostState.isComposing = true;
        mainState.currentIndex = 1;
        mainState.isBackVisible = true;
    },

    view(ghost) {
        mainState.route = 'ghosts';
        ghostState.isComposing = false;
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
