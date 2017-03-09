import { socket } from '../../lib/icebear';
import state from '../layout/state';

export default class RoutedState {
    get isConnected() {
        return socket.connected;
    }

    get isActive() {
        if (!this._prefix) throw new Error('routed-state.js: no prefix');
        return state.route.startsWith(this._prefix);
    }

    get routes() {
        return state.routes;
    }
}
