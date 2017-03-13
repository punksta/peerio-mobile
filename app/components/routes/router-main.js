import React from 'react';
import { Animated } from 'react-native';
import { observable, reaction, action } from 'mobx';
import Router from './router';
import uiState from '../layout/ui-state';
import SettingsLevel1 from '../settings/settings-level-1';
import SettingsLevel2 from '../settings/settings-level-2';
import SettingsLevel3 from '../settings/settings-level-3';
import MessagingPlaceholder from '../messaging/messaging-placeholder';
import Ghosts from '../ghosts/ghosts';
import GhostsLevel1 from '../ghosts/ghosts-level-1';
import Chat from '../messaging/chat';
import Files from '../files/files';
import FileView from '../files/file-view';
import Logs from '../logs/logs';
import fileState from '../files/file-state';
import ghostState from '../ghosts/ghost-state';

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
    @observable modalRoute = null;
    @observable modalControl = null;
    @observable suppressTransition = false;
    animatedLeftMenu = new Animated.Value(0);
    animatedLeftMenuWidth = new Animated.Value(0);

    constructor() {
        super();
        this.add('files', [<Files />, <FileView />], fileState);
        this.add('ghosts', [<Ghosts />, <GhostsLevel1 />], ghostState);
        this.add('chats', [<MessagingPlaceholder />, <Chat />]);
        this.add('settings', [<SettingsLevel1 />, <SettingsLevel2 />, <SettingsLevel3 />]);
        this.add('logs', [<Logs />]);

        reaction(() => this.isLeftMenuVisible || this.isRightMenuVisible, visible => {
            visible && uiState.hideKeyboard();
        });
        reaction(() => this.currentIndex, i => (this.isBackVisible = i > 0));
        reaction(() => [this.route, this.currentIndex], i => uiState.hideAll());
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
            this.currentIndex = item ? 1 : 0;
            this.onTransition(route, true, item);
        };
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
        this.current && this.current.routeState && this.current.routeState.fabAction();
    }

    @action back() {
        if (this.currentIndex > 0) this.currentIndex--;
        this.onDeactivate(this.current);
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
routerMain.ghosts();

export default routerMain;
