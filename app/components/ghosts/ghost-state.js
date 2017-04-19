import { observable } from 'mobx';
import RoutedState from '../routes/routed-state';
import { tx } from '../utils/translator';
import { mailStore, User } from '../../lib/icebear';
import { popupUpgrade } from '../shared/popups';

class GhostState extends RoutedState {
    @observable isComposing = false;
    store = mailStore;

    compose() {
        if (!User.current.canSendGhost()) {
            popupUpgrade(tx('error_sendingMail'), null, tx('error_mailQuotaExceeded'));
            return;
        }
        this.isComposing = true;
        this.routerMain.ghosts({});
    }

    view(ghost) {
        this.isComposing = false;
        this.routerMain.ghosts(ghost);
        mailStore.selectedId = ghost.ghostId;
    }

    onTransition(active /* , ghost */) {
        active && mailStore.loadAllGhosts();
        // mailStore.selectedId = active && ghost ? ghost.ghostId : null;
    }

    get title() {
        return tx('title_mail');
    }

    fabAction() {
        this.compose();
    }
}

export default new GhostState();
