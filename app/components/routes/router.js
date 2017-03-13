import { reaction, action, observable } from 'mobx';

export default class Router {
    @observable route = '';
    routes = {};
    routesList = [];

    get current() {
        return this.routes[this.route] || null;
    }

    get first() {
        return this.routes[this.routesList[0]];
    }

    add(key, component, replace) {
        this.routesList.push(key);
        this.routes[key] = {
            index: this.routesList.length - 1,
            replace,
            key,
            component,
            transition: action(() => {
                setTimeout(() => {
                    this.route = key;
                }, 0);
            })
        };
        return this.routes[key];
    }
}
