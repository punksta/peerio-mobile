import { observable, action, reaction } from 'mobx';
import state from '../layout/state';
import store from '../../store/local-storage';
import Util from '../helpers/util';
import { User } from '../../lib/icebear';
import touchid from '../touchid/touchid-bridge';

const messagingState = observable({
    @action transition() {
        state.routes.compose.transition();
    },

    @action exit() {
        state.routes.main.transition();
    }
});

export default messagingState;

this.Peerio = this.Peerio || {};
this.Peerio.messagingState = messagingState;

