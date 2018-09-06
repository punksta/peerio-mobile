import React from 'react';
import { action, observable, computed } from 'mobx';
import uiState from '../layout/ui-state';

// to identify our drawers
// let lastDrawerId = 0;

/**
 * @typedef {Object} Beacon
 * @property {string} context where the drawer should show, contacts, chat list, etc ...
 * @property {component} component the React component, <TopDrawerMaintenance />, etc ...
 */
class BeaconState {
    beaconFlows = {
        onboarding: [
            'mobile-chat-icon',
            'mobile-create-dm',
            'mobile-upload-file',
            'mobile-contacts-icon',
            'mobile-contacts-search'
        ]
    };

    @computed get activeBeacons() {
        // all visible beacons in current layout
        return [];
    }
    
    @observable.shallow beacons = [];

    @observable beaconPosition = null;
    @observable beaconText = {
        textHeader: 'title',
        textLine1: 'subtitle',
        textLine2: 'subtitle',
        textLine3: 'subtitle'
    };

    requestBeacons(beacon) {
        console.log('>>> Requested beacons', beacon);

        const { id, position } = beacon;
        this.beacons.unshift(id);
        this.beaconPosition = position;
    }

    clearBeacons() {
        this.beacons = [];
    }


    // addDrawer(componentClass, context, propsParam) {
    //     lastDrawerId++;
    //     const props = propsParam || {};
    //     props.drawerId = lastDrawerId;
    //     this.drawers.unshift({
    //         component: React.createElement(componentClass, props),
    //         context,
    //         drawerId: lastDrawerId
    //     });
    // }

    // DRAWER_CONTEXT = {
    //     CHATS: 'chats',
    //     FILES: 'files',
    //     CONTACTS: 'contacts',
    //     SETTINGS: 'settings'
    // };

    // get globalDrawer() {
    //     return this.drawers.find(drawer => !drawer.context);
    // }

    // // TODO animate hiding drawer when keyboard is shown
    // // Try to get Global drawer. Else try to get Local drawer in the given context
    // // Otherwise return null
    // getDrawer(context) {
    //     // hide drawers when keyboard is visible
    //     if (uiState.keyboardHeight) return null;
    //     return this.globalDrawer || this.drawers.find(drawer => drawer.context === context);
    // }

    // // Try to dismiss top drawer in the specified context.
    // // Otherwise dismiss global drawer.
    // // Drawer is only removed after the animation is played
    // @action.bound
    // dismiss(drawerInstance) {
    //     const index = this.drawers.findIndex(
    //         drawer => drawer.drawerId === drawerInstance.props.drawerId
    //     );
    //     if (index !== -1) {
    //         this.drawers.splice(index, 1);
    //     } else {
    //         console.error(`drawerState.dismiss: Could not find drawer component to dismiss`);
    //     }
    // }

    // @action.bound dismissAll() {
    //     this.drawers.clear();
    // }
}

const beaconState = new BeaconState();

export default beaconState;
