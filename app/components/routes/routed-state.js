import { socket } from '../../lib/icebear';
import uiState from '../layout/ui-state';

export default class RoutedState {
    get isConnected() {
        return socket.connected;
    }

    get isActive() {
        if (!this._prefix) throw new Error('routed-state.js: no prefix');
        return uiState.route.startsWith(this._prefix);
    }

    get routes() {
        return uiState.routes;
    }
}
