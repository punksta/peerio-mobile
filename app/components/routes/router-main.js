import React from 'react';
import { Animated } from 'react-native';
import { observable, reaction, action, when } from 'mobx';
import Router from './router';
import uiState from '../layout/ui-state';
import SettingsLevel1 from '../settings/settings-level-1';
import SettingsLevel2 from '../settings/settings-level-2';
import SettingsLevel3 from '../settings/settings-level-3';
import Ghosts from '../ghosts/ghosts';
import GhostsLevel1 from '../ghosts/ghosts-level-1';
import Chat from '../messaging/chat';
import Files from '../files/files';
import FileView from '../files/file-view';
import Logs from '../logs/logs';
import fileState from '../files/file-state';
import ghostState from '../ghosts/ghost-state';
import chatState from '../messaging/chat-state';
import settingsState from '../settings/settings-state';
import contactState from '../contacts/contact-state';
import { enablePushNotifications } from '../../lib/push';
import routes from './routes';

const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';

class RouterMain extends Router {
    // current route object
    @observable current = null;
    @observable isLeftHamburgerVisible = true;
    @observable isBackVisible = false;
    @observable isLeftMenuVisible = false;
    @observable isRightMenuVisible = false;
    @observable isInputVisible = false;
    @observable blackStatusBar = false;
    @observable currentIndex = 0;
    @observable suppressTransition = false;
    animatedLeftMenu = new Animated.Value(0);
    animatedLeftMenuWidth = new Animated.Value(0);

    constructor() {
        super();
        routes.main = this;
        reaction(() => this.isLeftMenuVisible || this.isRightMenuVisible, visible => {
            visible && uiState.hideKeyboard();
        });
        reaction(() => this.currentIndex, i => (this.isBackVisible = i > 0));
        reaction(() => [this.route, this.currentIndex], () => uiState.hideAll());
    }

    initial() {
        this.add('files', [<Files />, <FileView />], fileState);
        this.add('ghosts', [<Ghosts />, <GhostsLevel1 />], ghostState);
        this.add('chats', [<Chat />], chatState);
        this.add('settings', [<SettingsLevel1 />, <SettingsLevel2 />, <SettingsLevel3 />], settingsState);
        this.add('logs', [<Logs />], { title: 'Logs' });

        this.ghosts();
        chatState.store.loadAllChats();
        when(() => !ghostState.store.loading && !chatState.store.loading, () => {
            (EN === 'peeriomobile') && enablePushNotifications();
        });
        when(() => !chatState.store.loading, () => contactState.store.loadLegacyContacts());
    }

    add(key, components, routeState) {
        const route = super.add(key, null);
        route.components = observable.ref(components);
        route.routeState = routeState;
        this[key] = route.transition = (item) => {
            if (this.route !== key) {
                this.onTransition(this.current, false, item);
            }
            this.resetMenus();
            this.current = route;
            this.route = key;
            this.currentIndex = (components.length > 1 && item) ? 1 : 0;
            this.onTransition(route, true, item);
            console.log(`router-main: transition to ${this.route}:${this.currentIndex}`);
        };
    }

    get title() {
        return this.current && this.current.routeState ? this.current.routeState.title : null;
    }

    get pages() {
        return this.current ? this.current.components : [];
    }

    get currentComponent() {
        return this.current && (this.current.components.length > this.currentIndex)
            ? this.current.components[this.currentIndex].type.prototype : {};
    }

    onTransition(route, active, param) {
        route && route.routeState && route.routeState.onTransition && route.routeState.onTransition(active, param);
    }

    @action fabAction() {
        console.log(`router-main.js: fab action`);
        this.current && this.current.routeState && this.current.routeState.fabAction();
    }

    @action back() {
        if (this.currentIndex > 0) this.currentIndex--;
        this.onTransition(this.current, false);
    }

    @action resetMenus() {
        this.isInputVisible = false;
        this.isLeftMenuVisible = false;
        this.isRightMenuVisible = false;
        this.isLeftHamburgerVisible = true;
        this.modalRoute = null;
    }

    @action toggleLeftMenu() {
        console.log('toggle left menu');
        this.isLeftMenuVisible = !this.isLeftMenuVisible;
        this.isRightMenuVisible = false;
    }

    @action toggleRightMenu() {
        this.isRightMenuVisible = !this.isRightMenuVisible;
        this.isLeftMenuVisible = false;
    }
}

const routerMain = new RouterMain();

export default routerMain;
