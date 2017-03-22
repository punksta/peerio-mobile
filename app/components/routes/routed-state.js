import { socket } from '../../lib/icebear';
import routes from './routes';

export default class RoutedState {
    _prefix = null;
    _routerMain = null;
    static _routerApp = null;

    get routes() { return routes; }

    get isConnected() {
        return socket.connected;
    }

    get isActive() {
        if (!this._prefix) throw new Error('routed-state.js: no prefix');
        return !![routes.main, routes.app].filter(a => a.route.startsWith(this._prefix)).length;
    }

    get routerMain() { return this.routes.main; }

    get routerModal() { return this.routes.modal; }
}
