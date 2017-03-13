import { observable } from 'mobx';
import routerMain from '../routes/router-main';
import { tx } from '../utils/translator';
import { mailStore, User } from '../../lib/icebear';
import { popupUpgrade } from '../shared/popups';

class GhostState {
    @observable isComposing = false;

    compose() {
        if (!User.current.canSendGhost()) {
            popupUpgrade(tx('ghosts_sendingError'), null, tx('ghosts_quotaExceeded'));
            return;
        }
        this.isComposing = true;
        routerMain.ghosts({});
    }

    view(ghost) {
        this.isComposing = false;
        routerMain.ghosts(ghost);
        mailStore.selectedId = ghost.ghostId;
    }

    onTransition(active, ghost) {
        mailStore.selectedId = active && ghost ? ghost.ghostId : null;
    }

    get title() {
        return tx('ghosts');
    }

    fabAction() {
        this.compose();
    }
}

export default new GhostState();
