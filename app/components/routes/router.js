import { action, observable, when } from 'mobx';

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
                console.log(`router.js: ${this.route} => ${key}`);
                this.route = key;
            })
        };
        this[key] = this.routes[key].transition;
        return this.routes[key];
    }
}
