import React from 'react';
import { Animated, LayoutAnimation } from 'react-native';
import { observable, reaction, action, when } from 'mobx';
import Router from './router';
import uiState from '../layout/ui-state';
import SettingsLevel1 from '../settings/settings-level-1';
import SettingsLevel2 from '../settings/settings-level-2';
import SettingsLevel3 from '../settings/settings-level-3';
import Ghosts from '../ghosts/ghosts';
import GhostsLevel1 from '../ghosts/ghosts-level-1';
import Chat from '../messaging/chat';
import ChatList from '../messaging/chat-list';
import Files from '../files/files';
import FileView from '../files/file-view';
import Logs from '../logs/logs';
import mainState from '../main/main-state';
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
    @observable isBackVisible = false;
    @observable isInputVisible = false;
    @observable blackStatusBar = false;
    @observable currentIndex = 0;
    @observable suppressTransition = false;

    constructor() {
        super();
        routes.main = this;
        reaction(() => this.currentIndex, i => (this.isBackVisible = i > 0));
        reaction(() => [this.route, this.currentIndex], () => uiState.hideAll());
    }

    @action async initial() {
        this.add('files', [<Files />, <FileView />], fileState);
        this.add('ghosts', [<Ghosts />, <GhostsLevel1 />], ghostState);
        this.add('chats', [<ChatList />, <Chat />], chatState);
        this.add('settings', [<SettingsLevel1 />, <SettingsLevel2 />, <SettingsLevel3 />], settingsState);
        this.add('logs', [<Logs />], { title: 'Logs' });
        if (EN === 'peeriomobile') await enablePushNotifications();
        await mainState.init();
        await chatState.init();
        await contactState.init();
        await fileState.init();
        this.chats();
    }

    add(key, components, routeState) {
        const route = super.add(key, null);
        route.components = observable.ref(components);
        route.routeState = routeState;
        this[key] = route.transition = (item, suppressTransition) => {
            if (this.route !== key) {
                !suppressTransition && LayoutAnimation.easeInEaseOut();
                this.onTransition(this.current, false, item);
            }
            this.resetMenus();
            this.current = route;
            this.route = key;

            const newIndex = (components.length > 1 && item) ? 1 : 0;
            if (newIndex !== this.currentIndex) {
                !suppressTransition && LayoutAnimation.easeInEaseOut();
            }
            this.currentIndex = newIndex;
            this.onTransition(route, true, item);
            console.log(`router-main: transition to ${this.route}:${this.currentIndex}`);
        };
    }

    get title() {
        return this.current && this.current.routeState ? this.current.routeState.title : null;
    }

    get titleAction() {
        return this.current && this.current.routeState ? this.current.routeState.titleAction : null;
    }

    get pages() {
        return this.current ? this.current.components : [];
    }

    get currentComponent() {
        return this.current && (this.current.components.length > this.currentIndex)
            ? this.current.components[this.currentIndex].type.prototype : {};
    }

    onTransition(route, active, param) {
        try {
            route && route.routeState && route.routeState.onTransition && route.routeState.onTransition(active, param);
        } catch (e) {
            console.error(e);
        }
    }

    @action fabAction() {
        console.log(`router-main.js: fab action`);
        this.current && this.current.routeState && this.current.routeState.fabAction();
    }

    @action back() {
        if (this.currentIndex > 0) this.currentIndex--;
        this.onTransition(this.current, true);
        LayoutAnimation.easeInEaseOut();
        console.log(`router-main: transition to ${this.route}:${this.currentIndex}`);
    }

    @action resetMenus() {
        this.isInputVisible = false;
        this.modalRoute = null;
    }
}

const routerMain = new RouterMain();

export default routerMain;
