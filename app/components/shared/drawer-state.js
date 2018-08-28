import React from 'react';
import { action, observable } from 'mobx';
import uiState from '../layout/ui-state';

// to identify our drawers
let lastDrawerId = 0;

/**
 * @typedef {Object} Drawer
 * @property {string} context where the drawer should show, contacts, chat list, etc ...
 * @property {component} component the React component, <TopDrawerMaintenance />, etc ...
 */
class DrawerState {
    @observable.shallow drawers = [];

    addDrawer(componentClass, context, propsParam) {
        lastDrawerId++;
        const props = propsParam || {};
        props.drawerId = lastDrawerId;
        this.drawers.unshift({
            component: React.createElement(componentClass, props),
            context,
            drawerId: lastDrawerId
        });
    }

    DRAWER_CONTEXT = {
        SIGNUP: 'signup',
        CHATS: 'chats',
        FILES: 'files',
        CONTACTS: 'contacts',
        SETTINGS: 'settings'
    };

    get globalDrawer() {
        return this.drawers.find(drawer => !drawer.context);
    }

    // TODO animate hiding drawer when keyboard is shown
    // Try to get Global drawer. Else try to get Local drawer in the given context
    // Otherwise return null
    getDrawer(context) {
        // hide drawers when keyboard is visible
        if (uiState.keyboardHeight) return null;
        return this.globalDrawer || this.drawers.find(drawer => drawer.context === context);
    }

    // Try to dismiss top drawer in the specified context.
    // Otherwise dismiss global drawer.
    // Drawer is only removed after the animation is played
    @action.bound
    dismiss(drawerInstance) {
        const index = this.drawers.findIndex(
            drawer => drawer.drawerId === drawerInstance.props.drawerId
        );
        if (index !== -1) {
            this.drawers.splice(index, 1);
        } else {
            console.error(`drawerState.dismiss: Could not find drawer component to dismiss`);
        }
    }

    @action.bound dismissAll() {
        this.drawers.clear();
    }
}

const drawerState = new DrawerState();

export default drawerState;
